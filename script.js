// 🔥 Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmGlv9cOYBg6mNPeIqffhECLXCvjxe_Mg",
    authDomain: "shop-ayam.firebaseapp.com",
    databaseURL: "https://shop-ayam-default-rtdb.firebaseio.com",
    projectId: "shop-ayam",
    storageBucket: "shop-ayam.appspot.com",
    messagingSenderId: "709890348798",
    appId: "1:709890348798:web:d2efaab4f988374bfe77af",
    measurementId: "G-1MJWH8270Y"
};

// 🔹 Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🟢 Tambah Barang ke Firebase
function addEvent() {
    let name = document.getElementById('eventName').value;
    let price = document.getElementById('eventPrice').value;
    let imageInput = document.getElementById('eventImage');

    if (!name || !price || imageInput.files.length === 0) {
        alert("Semua kolom harus diisi!");
        return;
    }

    let file = imageInput.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        let eventData = {
            name: name,
            price: price,
            image: event.target.result
        };

        // 🔹 Simpan ke Firebase
        firebase.database().ref('events').push(eventData, function(error) {
            if (error) {
                alert("Gagal menambahkan barang!");
            } else {
                alert("Barang berhasil ditambahkan!");
                document.getElementById('eventName').value = "";
                document.getElementById('eventPrice').value = "";
                document.getElementById('eventImage').value = "";
            }
        });
    };

    reader.readAsDataURL(file);
}

// 🔹 Load Data Barang dari Firebase
function loadEvents() {
    db.ref('events').on('value', (snapshot) => {
        let container = document.getElementById('eventContainer');
        container.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            let data = childSnapshot.val();
            let id = childSnapshot.key;

            let eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
                <img src="${data.image}" alt="${data.name}">
                <p>${data.name} - Rp ${data.price}</p>
                <button onclick="addToCart('${id}', '${data.name}', ${data.price}')">+</button>
                <button onclick="removeFromCart('${id}')">-</button>
                <button class="delete" onclick="deleteEvent('${id}')">Hapus</button>
            `;
            container.appendChild(eventDiv);
        });
    });
}

// 🔴 Hapus Barang dengan Password
function deleteEvent(eventId) {
    let password = prompt("Masukkan password untuk menghapus:");
    if (password === "4718") {
        db.ref('events/' + eventId).remove();
    } else {
        alert("Password salah!");
    }
}

// 🛒 Keranjang Belanja
let cart = {};

function addToCart(id, name, price) {
    if (!cart[id]) {
        cart[id] = { name, price, quantity: 1 };
    } else {
        cart[id].quantity += 1;
    }
    updateCart();
}

function removeFromCart(id) {
    if (cart[id]) {
        cart[id].quantity -= 1;
        if (cart[id].quantity <= 0) delete cart[id];
    }
    updateCart();
}

// 🔄 Update Tampilan Keranjang
function updateCart() {
    let cartContainer = document.getElementById('cartContainer');
    cartContainer.innerHTML = "";
    let totalItems = 0;

    for (let id in cart) {
        let item = cart[id];
        let div = document.createElement('div');
        div.className = "cart";
        div.innerHTML = `<p>${item.name} (x${item.quantity}) - Rp ${item.price * item.quantity}</p>`;
        cartContainer.appendChild(div);
        totalItems += item.quantity;
    }

    document.getElementById('checkoutButton').disabled = totalItems === 0;
}

// 🛍️ Checkout ke WhatsApp
function checkout() {
    let message = "Pesanan saya:\n";
    for (let id in cart) {
        let item = cart[id];
        message += `${item.name} x${item.quantity} - Rp ${item.price * item.quantity}\n`;
    }

    let waNumber = "6285372736144";
    let waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = waLink;
}

// 🔄 Muat Data Saat Halaman Dibuka
window.onload = function() {
    loadEvents();
};
