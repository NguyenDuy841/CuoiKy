// ==============================================
// 1. DỮ LIỆU SẢN PHẨM & CẤU HÌNH
// ==============================================
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 34990000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2023/09/iphone-15-pro-max-titan-xanh.jpg", category: "iphone", type: "mobile", specs: { screen: "6.7 inch OLED", chip: "Apple A17 Pro", ram: "8GB", rom: "256GB", battery: "4422 mAh" } },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 31990000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/01/samsung-galaxy-s24-ultra-cu-tim-titan.jpg.webp", category: "samsung", type: "mobile", specs: { screen: "6.8 inch Dynamic AMOLED 2X", chip: "Snapdragon 8 Gen 3", ram: "12GB", rom: "256GB", battery: "5000 mAh" } },
    { id: 3, name: "Xiaomi 14 Pro", price: 19990000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2023/10/xiaomi-14-pro-titanium.jpg.webp", category: "xiaomi", type: "mobile", specs: { screen: "6.73 inch LTPO AMOLED", chip: "Snapdragon 8 Gen 3", ram: "12GB", rom: "256GB", battery: "4880 mAh" } },
    { id: 4, name: "iPhone 11 Cũ 99%", price: 6500000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-tim.jpg.webp", category: "iphone", type: "mobile", specs: { screen: "6.1 inch IPS LCD", chip: "Apple A13 Bionic", ram: "4GB", rom: "64GB", battery: "3110 mAh" } },
    { id: 6, name: "Realme GT 5 5G", price: 9200000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2023/08/realme-gt5-bac.jpg", category: "realme", type: "mobile", specs: { screen: "6.74 inch AMOLED", chip: "Snapdragon 8 Gen 2", ram: "12GB", rom: "256GB", battery: "5240 mAh" } },
    { id: 9, name: "Máy tính bảng iPad Air 5 M1", price: 21500000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/08/ipad-air-5-2022.jpg.webp", category: "iphone", type: "tablet", specs: { screen: "11 inch Liquid Retina", chip: "Apple M2", ram: "8GB", rom: "128GB", battery: "7538 mAh" } },
    { id: 10, name: "Samsung Galaxy Tab S9", price: 19900000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2023/07/samsung-galaxy-tab-s9-den.jpg.webp", category: "samsung", type: "tablet", specs: { screen: "11 inch Dynamic AMOLED 2X", chip: "Snapdragon 8 Gen 2", ram: "8GB", rom: "128GB", battery: "8400 mAh" } },
    { id: 11, name: "Xiaomi Pad 6", price: 8990000, img: "https://cdn.mobilecity.vn/mobilecity-vn/images/2023/04/xiaomi-mi-pad-6-vang.jpg.webp", category: "xiaomi", type: "tablet", specs: { screen: "11 inch IPS LCD", chip: "Snapdragon 870", ram: "8GB", rom: "128GB", battery: "8840 mAh" } }
];

// Khởi tạo Giỏ hàng từ LocalStorage (nếu có)
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// ==============================================
// 2. LOGIC GIỎ HÀNG (ADD, REMOVE, SHOW)
// ==============================================

// Lưu giỏ hàng vào bộ nhớ
function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
}

// Thêm sản phẩm vào giỏ
function addToCart(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id == id);
    
    if (existingItem) {
        existingItem.quantity++; // Nếu có rồi thì tăng số lượng
    } else {
        // Nếu chưa có thì thêm mới
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    openCart(); // Mở giỏ hàng cho khách thấy
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(id) {
    if(confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        cart = cart.filter(item => item.id != id);
        saveCart();
    }
}

// Thay đổi số lượng (Tăng/Giảm)
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id == id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id); // Nếu giảm về 0 thì xóa luôn
        } else {
            saveCart();
        }
    }
}

// Cập nhật số lượng trên icon Header
// Cập nhật số lượng trên icon Header
// --- Thay thế hàm updateCartIcon cũ bằng hàm này ---

function updateCartIcon() {
    // 1. Tính tổng số lượng
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 2. Tìm thẻ span chứa số (id="cart-count")
    const countSpan = document.getElementById('cart-count');
    
    if (countSpan) {
        // Cách an toàn: Chỉ sửa số, không sửa icon hay sự kiện click
        countSpan.innerText = `(${totalQty})`;
    } else {
        // Dự phòng: Nếu không tìm thấy id cart-count thì tìm theo class
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> <span>(${totalQty})</span>`;
            // Quan trọng: Gán lại sự kiện click nếu lỡ bị ghi đè
            cartBtn.onclick = openCart; 
        }
    }
}

// Hiển thị danh sách trong Modal Giỏ hàng
function renderCartItems() {
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total-price');
    if (!cartBody) return;

    cartBody.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Giỏ hàng đang trống.</p>';
    } else {
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            cartBody.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="btn-qty" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-qty" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            `;
        });
    }
    
    if (cartTotal) cartTotal.innerText = formatCurrency(totalPrice);
}

// Tự động Chèn HTML Giỏ hàng vào trang (để không phải sửa file HTML)
function injectCartHTML() {
    const cartHTML = `
        <div class="cart-overlay" id="cart-overlay" onclick="closeCart()"></div>
        <div class="cart-modal" id="cart-modal">
            <div class="cart-header">
                <span><i class="fa-solid fa-bag-shopping"></i> Giỏ hàng của bạn</span>
                <span class="cart-close" onclick="closeCart()">&times;</span>
            </div>
            <div class="cart-body" id="cart-body">
                </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Tổng tiền:</span>
                    <span id="cart-total-price">0 ₫</span>
                </div>
                <button class="btn-checkout" onclick="alert('Chức năng thanh toán đang phát triển!')">Thanh toán ngay</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
}

function openCart() {
    document.getElementById('cart-overlay').style.display = 'block';
    setTimeout(() => {
        document.getElementById('cart-modal').classList.add('open');
    }, 10);
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('open');
    setTimeout(() => {
        document.getElementById('cart-overlay').style.display = 'none';
    }, 300);
}

// ==============================================
// 3. LOGIC HIỂN THỊ SẢN PHẨM (TRANG CHỦ)
// ==============================================
const productList = document.getElementById('product-list');
if (productList) {
    let currentType = 'all';

    function renderProducts(data) {
        productList.innerHTML = '';
        if (data.length === 0) {
            productList.innerHTML = '<p style="grid-column: span 4; text-align:center; color:white;">Không tìm thấy sản phẩm.</p>';
            return;
        }

        data.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            // Click vào thẻ thì xem chi tiết
            card.onclick = function(e) {
                // Nếu click vào nút thêm giỏ hàng thì KHÔNG chuyển trang
                if (e.target.closest('.btn-add-cart-mini')) return;
                window.location.href = `chitiet.html?id=${product.id}`;
            };

            card.innerHTML = `
                <div class="badge-hot">Hot</div>
                
                <button class="btn-add-cart-mini" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>

                <div class="img-placeholder">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    // Các hàm lọc (Giữ nguyên)
    function filterByType(type, element) {
        currentType = type;
        document.getElementById('category-select').value = 'all';
        const links = document.querySelectorAll('.main-nav a');
        links.forEach(link => link.classList.remove('active-nav'));
        if(element) element.classList.add('active-nav');
        filterAndSort();
    }

    function filterAndSort() {
        const category = document.getElementById('category-select').value;
        const sortValue = document.getElementById('sort-select').value;
        let filtered = currentType === 'all' ? [...products] : products.filter(p => p.type === currentType);
        if (category !== 'all') filtered = filtered.filter(p => p.category === category);
        if (sortValue === 'asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortValue === 'desc') filtered.sort((a, b) => b.price - a.price);
        renderProducts(filtered);
    }

    function searchProducts() {
        const keyword = document.getElementById('search-input').value.toLowerCase().trim();
        const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
        renderProducts(filtered);
    }
    
    // Init Trang chủ
    document.getElementById('category-select').addEventListener('change', filterAndSort);
    document.getElementById('sort-select').addEventListener('change', filterAndSort);
    renderProducts(products);
}

// ==============================================
// 4. LOGIC TRANG CHI TIẾT (chitiet.html)
// ==============================================
const detailContainer = document.getElementById('detail-container');
if (detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id == productId);

    if (product) {
        document.title = product.name + " - MobileCity";
        const specs = product.specs || {};

        detailContainer.innerHTML = `
            <div class="detail-left">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="detail-right">
                <h1 class="detail-title">${product.name}</h1>
                <div class="detail-price">${formatCurrency(product.price)}</div>
                
                <div class="detail-specs">
                    <h3>Cấu hình chi tiết:</h3>
                    <table>
                        <tr><td>Màn hình:</td><td>${specs.screen}</td></tr>
                        <tr><td>Chip:</td><td>${specs.chip}</td></tr>
                        <tr><td>RAM:</td><td>${specs.ram}</td></tr>
                        <tr><td>ROM:</td><td>${specs.rom}</td></tr>
                        <tr><td>Pin:</td><td>${specs.battery}</td></tr>
                    </table>
                </div>

                <button class="btn-buy-now" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-shopping"></i> THÊM VÀO GIỎ HÀNG
                </button>
                <a href="index.html" class="btn-back">← Quay lại</a>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `<h2>Không tìm thấy sản phẩm!</h2>`;
    }
}

// ==============================================
// 5. CHẠY KHI TẢI TRANG (CHUNG CHO CẢ 2 TRANG)
// ==============================================
window.onload = function() {
    injectCartHTML();   // Tạo giao diện giỏ hàng
    updateCartIcon();   // Cập nhật số lượng
    renderCartItems();  // Hiển thị sản phẩm trong giỏ
};
/* --- LOGIC CHO TRANG GIỎ HÀNG RIÊNG (giohang.html) --- */

// Hàm render trang giỏ hàng
function renderCartPage() {
    const container = document.getElementById('cart-page-content');
    if (!container) return; // Nếu không tìm thấy id này (tức là đang ở trang chủ) thì thoát

    if (cart.length === 0) {
        // TRƯỜNG HỢP 1: GIỎ HÀNG TRỐNG (Giống hệt ảnh bạn gửi)
        container.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>
                <div class="cart-empty-text">Giỏ hàng trống</div>
                <div class="cart-empty-sub">Không có sản phẩm nào trong giỏ hàng</div>
                <a href="index.html">
                    <button class="btn-back-home">Về trang chủ</button>
                </a>
            </div>
        `;
    } else {
        // TRƯỜNG HỢP 2: CÓ SẢN PHẨM -> HIỆN DANH SÁCH
        let total = 0;
        let htmlItems = cart.map(item => {
            total += item.price * item.quantity;
            return `
                <tr>
                    <td><img src="${item.img}"></td>
                    <td>
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="color:red;">${formatCurrency(item.price)}</div>
                    </td>
                    <td>
                        <div class="cart-item-controls" style="border:1px solid #ccc; display:inline-flex;">
                            <button class="btn-qty" onclick="changeQuantity(${item.id}, -1)" style="background:#fff; color:#333;">-</button>
                            <span style="color:#333; line-height:28px;">${item.quantity}</span>
                            <button class="btn-qty" onclick="changeQuantity(${item.id}, 1)" style="background:#fff; color:#333;">+</button>
                        </div>
                    </td>
                    <td>
                         <i class="fa-solid fa-trash" style="cursor:pointer; color:#999;" onclick="removeFromCart(${item.id})"></i>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="cart-list-wrapper">
                <h2>Giỏ hàng của bạn (${cart.length} sản phẩm)</h2>
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Thông tin</th>
                            <th>Số lượng</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlItems}
                    </tbody>
                </table>
                <div class="cart-summary">
                    <span class="total-label">Tổng tiền:</span>
                    <span class="total-value">${formatCurrency(total)}</span>
                    <br>
                    <button class="btn-payment" onclick="alert('Chức năng thanh toán đang phát triển')">ĐẶT HÀNG NGAY</button>
                </div>
            </div>
        `;
    }
}

// Sửa lại hàm saveCart một chút để nó tự render lại nếu đang ở trang giỏ hàng
const originalSaveCart = saveCart; // Lưu hàm cũ
saveCart = function() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartIcon();
    
    // Nếu đang ở trang chủ thì render popup
    const popupBody = document.getElementById('cart-body');
    if(popupBody) renderCartItems(); 

    // Nếu đang ở trang giohang.html thì render trang
    renderCartPage(); 
}

// Chạy khi tải trang
window.addEventListener('load', () => {
    renderCartPage();
});
/* --- HÀM XỬ LÝ CHO MENU ĐA CẤP --- */

function filterBrandFromMenu(brand) {
    // 1. Reset loại về tất cả trước (hoặc giữ nguyên tùy logic)
    // Ở đây ta reset về 'all' để tìm kiếm rộng nhất trong các loại
    // Hoặc nếu muốn bấm iPhone trong mục Điện thoại thì chỉ tìm điện thoại iPhone
    
    // Set giá trị cho ô select hãng
    const select = document.getElementById('category-select');
    if(select) {
        // Cần đảm bảo value trong option khớp với brand truyền vào
        // Ví dụ: brand='iphone' thì option value phải là 'iphone'
        select.value = brand;
        
        // Gọi lại hàm lọc chính
        filterAndSort();
    }
}