/* =========================================================
   COMMUNITY FOOD BANK
   LOGIN + REGISTRATION + USER DISPLAY + CART
   ========================================================= */


/* =========================================================
   REGISTRATION
   ========================================================= */

const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {

    registrationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email")
            .value.trim()
            .toLowerCase();

        const phone = document.getElementById("phone").value.trim();

        const role = document.getElementById("role").value;

        const password = document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registrationMessage");


        /* Check password */

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";
            message.style.color = "red";

            return;
        }


        /* Check password length */

        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            message.style.color = "red";

            return;
        }


        /* Check role */

        if (role === "") {

            message.textContent =
                "Please select a user type.";

            message.style.color = "red";

            return;
        }


        /* Get existing users */

        let users =
            JSON.parse(localStorage.getItem("foodBankUsers")) || [];


        /* Check whether email already exists */

        const existingUser =
            users.find(function (user) {

                return user.email === email;

            });


        if (existingUser) {

            message.textContent =
                "An account with this email already exists.";

            message.style.color = "red";

            return;
        }


        /* Create user */

        const newUser = {

            name: name,

            email: email,

            phone: phone,

            role: role,

            password: password

        };


        /* Save user */

        users.push(newUser);

        localStorage.setItem(
            "foodBankUsers",
            JSON.stringify(users)
        );


        /* Success */

        message.textContent =
            "Registration successful! Redirecting to login...";

        message.style.color = "green";


        registrationForm.reset();


        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    });

}



/* =========================================================
   LOGIN
   ========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document.getElementById("loginPassword").value;


        const rememberMe =
            document.getElementById("rememberMe").checked;


        const message =
            document.getElementById("loginMessage");


        /* Get users */

        const users =
            JSON.parse(
                localStorage.getItem("foodBankUsers")
            ) || [];


        /* Find matching user */

        const user =
            users.find(function (user) {

                return (
                    user.email === email &&
                    user.password === password
                );

            });


        /* Invalid login */

        if (!user) {

            message.textContent =
                "Invalid email or password.";

            message.style.color = "red";

            return;
        }


        /* Save current user */

        localStorage.setItem(
            "foodBankCurrentUser",
            JSON.stringify(user)
        );


        /* Remember login */

        if (rememberMe) {

            localStorage.setItem(
                "foodBankRemember",
                "true"
            );

        } else {

            localStorage.removeItem(
                "foodBankRemember"
            );

        }


        /* Success */

        message.textContent =
            "Login successful!";

        message.style.color = "green";


        /* Redirect according to role */

        setTimeout(function () {

            redirectUser(user.role);

        }, 800);

    });

}



/* =========================================================
   ROLE REDIRECTION
   ========================================================= */

function redirectUser(role) {

    if (role === "Community Member") {

        window.location.href = "community.html";

    }

    else if (role === "Farmer") {

        window.location.href = "farmer.html";

    }

    else if (role === "Food Donor") {

        window.location.href = "donor.html";

    }

    else if (role === "Volunteer") {

        window.location.href = "volunteer.html";

    }

    else {

        window.location.href = "index.html";

    }

}



/* =========================================================
   GET CURRENT USER
   ========================================================= */

function getCurrentUser() {

    const savedUser =
        localStorage.getItem("foodBankCurrentUser");


    if (!savedUser) {

        return null;

    }


    return JSON.parse(savedUser);

}



/* =========================================================
   DISPLAY LOGGED-IN USER
   ========================================================= */

function displayCurrentUser() {

    const user = getCurrentUser();


    if (!user) {

        return;

    }


    /* Name */

    const nameElements =
        document.querySelectorAll(".logged-user-name");


    nameElements.forEach(function (element) {

        element.textContent = user.name;

    });


    /* Email */

    const emailElements =
        document.querySelectorAll(".logged-user-email");


    emailElements.forEach(function (element) {

        element.textContent = user.email;

    });


    /* Role */

    const roleElements =
        document.querySelectorAll(".logged-user-role");


    roleElements.forEach(function (element) {

        element.textContent = user.role;

    });


    /* Welcome message */

    const welcomeElements =
        document.querySelectorAll(".welcome-user");


    welcomeElements.forEach(function (element) {

        element.textContent =
            "Welcome, " + user.name + "!";

    });

}



/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    localStorage.removeItem(
        "foodBankCurrentUser"
    );

    localStorage.removeItem(
        "foodBankRemember"
    );


    window.location.href =
        "login.html";

}
/* =========================================================
   NAVBAR: SHOW / HIDE ITEMS BASED ON LOGIN STATE
   ========================================================= */

function updateNavbar() {

    const user = getCurrentUser();
    const isLoggedIn = user !== null;

    /* Login link: only when logged OUT */
    document
        .querySelectorAll('nav a[href="login.html"]')
        .forEach(function (link) {
            link.style.display = isLoggedIn ? "none" : "";
        });

    /* Register link: only when logged OUT */
    document
        .querySelectorAll('nav a[href="registration.html"]')
        .forEach(function (link) {
            link.style.display = isLoggedIn ? "none" : "";
        });

    /* User name display: only when logged IN */
    document
        .querySelectorAll(".user-display")
        .forEach(function (el) {
            el.style.display = isLoggedIn ? "" : "none";
        });

    /* Logout button: only when logged IN */
    document
        .querySelectorAll('nav button[onclick="logoutUser()"]')
        .forEach(function (btn) {
            btn.style.display = isLoggedIn ? "" : "none";
        });
}



/* =========================================================
   CART
   ========================================================= */

let cart = [];


/* Load cart */

function loadSavedCart() {

    const savedCart =
        localStorage.getItem("foodBankCart");


    if (savedCart) {

        cart = JSON.parse(savedCart);

    } else {

        /* VERY IMPORTANT:
           New cart starts empty */

        cart = [];

    }

}



/* Save cart */

function saveCart() {

    localStorage.setItem(
        "foodBankCart",
        JSON.stringify(cart)
    );

}



/* Add item */

function addToCart(name, price, icon) {

    const existingItem =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existingItem) {

        existingItem.quantity++;

    }

    else {

        cart.push({

            name: name,

            price: price,

            quantity: 1,

            icon: icon

        });

    }


    saveCart();


    alert(
        name + " added to cart! 🛒"
    );

}



/* Display cart */

function displayCart() {

    const cartContainer =
        document.querySelector(".cart-container");


    if (!cartContainer) {

        return;

    }


    /* EMPTY CART */

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty 🛒</h2>

                <p>
                    Add food items to your cart.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;


        updateSummary();

        return;

    }


    /* CART HAS ITEMS */

    cartContainer.innerHTML = "";


    cart.forEach(function (item, index) {

        const itemElement =
            document.createElement("div");


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-info">

                <span class="cart-icon">
                    ${item.icon}
                </span>

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} / kg
                    </p>

                </div>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <div class="item-price">

                ₹${item.price * item.quantity}

            </div>


            <button
                class="remove-btn"
                onclick="removeItem(${index})">

                Remove

            </button>

        `;


        cartContainer.appendChild(itemElement);

    });


    updateSummary();

}



/* Increase quantity */

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

    displayCart();

}



/* Decrease quantity */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    else {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

}



/* Remove item */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();

}



/* =========================================================
   ORDER SUMMARY
   ========================================================= */

function updateSummary() {

    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal +=
            item.price * item.quantity;

    });


    /*
       Delivery charge:

       Empty cart = ₹0
       Cart has items = ₹10
    */

    let delivery = 0;

    if (cart.length > 0) {
        delivery = 10;
    }


    let total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById("cartSubtotal");

    const deliveryElement =
        document.getElementById("cartDelivery");

    const totalElement =
        document.getElementById("cartTotal");


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" + subtotal;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            "₹" + delivery;

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" + total;

    }

}



/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    alert(
        "Thank you! Your order has been submitted. 🌱"
    );


    cart = [];


    saveCart();

    displayCart();

}



/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSavedCart();

        displayCart();

        displayCurrentUser();

        updateNavbar();   // <-- added

    }
);
