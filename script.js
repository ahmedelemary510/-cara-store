const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  })
};

if(close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  })
}

const glassLinks = document.querySelectorAll('#navbar li a:not(#langToggle), #mobile a:not(#bar)');
glassLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
            e.preventDefault();
            
            let container = this.querySelector('.ripple-container');
            if (!container) {
                container = document.createElement('span');
                container.classList.add('ripple-container');
                this.appendChild(container);
            }
            container.innerHTML = '';
            
            const ripple = document.createElement('span');
            ripple.classList.add('glass-ripple');
            container.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                window.location.href = href;
            }, 180);
        }
    });
});

function updateCounts() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
    
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
    const favTotal = favoritesItems.length;

    const desktopCartLink = document.querySelector('#lg-bag a');
    const mobileCartLink = document.querySelector('#mobile a[href="cart.html"], #mobile a[href="cart-Arabic.html"]');

    [desktopCartLink, mobileCartLink].forEach(link => {
        if (link) {
            let countBadge = link.querySelector('.cart-count');
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.classList.add('cart-count');
                link.appendChild(countBadge);
            }
            countBadge.innerText = cartTotal;
            countBadge.style.display = cartTotal > 0 ? 'flex' : 'none';
        }
    });

    const desktopFavLink = document.querySelector('#navbar li a[href="favorites.html"], #navbar li a[href="favorites-Arabic.html"]');
    const mobileFavLink = document.querySelector('#mobile a[href="favorites.html"], #mobile a[href="favorites-Arabic.html"]');

    [desktopFavLink, mobileFavLink].forEach(link => {
        if (link) {
            let countBadge = link.querySelector('.fav-count');
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.classList.add('fav-count');
                link.style.position = 'relative';
                link.appendChild(countBadge);
            }
            countBadge.innerText = favTotal;
            countBadge.style.display = favTotal > 0 ? 'flex' : 'none';
        }
    });
}

window.addEventListener('load', updateCounts);
const langToggle = document.getElementById('langToggle');

let currentPathName = window.location.pathname;
let currentFileName = currentPathName.substring(currentPathName.lastIndexOf('/') + 1);

if (!currentFileName || currentFileName === '/') {
    currentFileName = 'index.html';
}

const preferredLanguage = localStorage.getItem('preferredLanguage');

    if (preferredLanguage) {
    if (preferredLanguage === 'arabic' && !currentFileName.includes('-Arabic.html')) {
        const nonArabicPages = ['login.html', 'Register.html'];
        if (!nonArabicPages.includes(currentFileName)) {
            let arabicFileName = currentFileName.replace('.html', '-Arabic.html');
            window.location.replace(arabicFileName);
        }
    } else if (preferredLanguage === 'english' && currentFileName.includes('-Arabic.html')) {
        let englishFileName = currentFileName.replace('-Arabic.html', '.html');
        window.location.replace(englishFileName);
    }
}

if (langToggle) {
  langToggle.addEventListener('click', (e) => {
    e.preventDefault();
    let pathName = window.location.pathname;
    let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

    if (!fileName || fileName === '/') {
        fileName = 'index.html';
    }

    if (fileName.includes('-Arabic.html')) {
        localStorage.setItem('preferredLanguage', 'english');
        let englishFileName = fileName.replace('-Arabic.html', '.html');
        window.location.href = englishFileName;
    } else {
        localStorage.setItem('preferredLanguage', 'arabic');
        const nonArabicPages = ['login.html', 'Register.html'];
        if (nonArabicPages.includes(fileName)) {
            window.location.href = 'index-Arabic.html';
        } else {
            let arabicFileName = fileName.replace('.html', '-Arabic.html');
            window.location.href = arabicFileName;
        }
    }
  });
}

/* --- Cart Logic --- */

const addCartBtns = document.querySelectorAll('.pro .cart');
addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const proDiv = e.target.closest('.pro');
        if (!proDiv) return;

        const imgSrc = proDiv.querySelector('img').getAttribute('src');
        const name = proDiv.querySelector('.des h5').innerText;
        let priceStr = proDiv.querySelector('.des h4').innerText.replace('EGP', '').trim();
        const price = parseInt(priceStr);

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        let existingItem = cartItems.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name, price, imgSrc, quantity: 1 });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCounts();
        alert('تمت إضافة المنتج إلى السلة بنجاح!\nProduct added to cart!');
    });
});

const addFavBtns = document.querySelectorAll('.pro .fav');
addFavBtns.forEach(btn => {
    btn.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const proDiv = e.target.closest('.pro');
        if (!proDiv) return;

        const imgSrc = proDiv.querySelector('img').getAttribute('src');
        const name = proDiv.querySelector('.des h5').innerText;
        let priceStr = proDiv.querySelector('.des h4').innerText.replace('EGP', '').trim();
        const price = parseInt(priceStr);

        let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
        
        let existingItem = favoritesItems.find(item => item.name === name);
        if (!existingItem) {
            favoritesItems.push({ name, price, imgSrc });
            localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
            updateCounts();
            alert('تمت إضافة المنتج إلى المفضلة!\nAdded to favorites!');
        } else {
            alert('المنتج موجود بالفعل في المفضلة!\nProduct already in favorites!');
        }
    });
});

const singleProBtn = document.querySelector('#prodetails .single-pro-details button.normal');
if (singleProBtn) {
    singleProBtn.addEventListener('click', () => {
        const details = document.querySelector('#prodetails');
        const name = details.querySelector('.single-pro-details h4').innerText;
        const priceStr = details.querySelector('.single-pro-details h2').innerText.replace('EGP', '').trim();
        const price = parseInt(priceStr);
        const imgSrc = details.querySelector('.single-pro-image img').getAttribute('src');
        const quantityInput = details.querySelector('.single-pro-details input');
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity <= 0) {
            alert('يرجى إدخال كمية صالحة\nPlease enter a valid quantity');
            return;
        }

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let existingItem = cartItems.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({ name, price, imgSrc, quantity });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCounts();
        alert('تمت إضافة المنتج إلى السلة بنجاح!\nProduct added to cart!');
    });
}

const singleFavBtn = document.querySelector('#prodetails .single-pro-details .wishlist-btn');
if (singleFavBtn) {
    singleFavBtn.addEventListener('click', () => {
        const details = document.querySelector('#prodetails');
        const name = details.querySelector('.single-pro-details h4').innerText;
        const priceStr = details.querySelector('.single-pro-details h2').innerText.replace('EGP', '').trim();
        const price = parseInt(priceStr);
        const imgSrc = details.querySelector('.single-pro-image img').getAttribute('src');

        let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
        let existingItem = favoritesItems.find(item => item.name === name);

        if (!existingItem) {
            favoritesItems.push({ name, price, imgSrc });
            localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
            updateCounts();
            alert('تمت إضافة المنتج إلى المفضلة!\nAdded to favorites!');
        } else {
            alert('المنتج موجود بالفعل في المفضلة!\nProduct already in favorites!');
        }
    });
}

const cartBody = document.getElementById('cart-body');
if (cartBody) {
    function renderCart() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartBody.innerHTML = '';
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><i class='bx bx-x-circle remove-item' data-index="${index}" style="cursor: pointer; font-size: 20px;"></i></td>
                <td><img src="${item.imgSrc}" alt="" style="width: 70px;"></td>
                <td>${item.name}</td>
                <td>EGP ${item.price}</td>
                <td>
                    <div class="quantity-control" style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                        <button type="button" class="minus-btn" data-index="${index}" style="width: 25px; height: 25px; border: 1px solid #cce7d0; background: #cce7d0; cursor: pointer; color: #1a1a1a; font-weight: bold; border-radius: 4px; font-size: 14px; padding: 0; display: flex; align-items: center; justify-content: center;">-</button>
                        <input type="text" value="${item.quantity}" readonly style="width: 40px; height: 25px; text-align: center; border: 1px solid #ccc; outline: none; background: #f9f9f9; padding: 0; margin: 0; font-size: 14px;">
                        <button type="button" class="plus-btn" data-index="${index}" style="width: 25px; height: 25px; border: 1px solid #cce7d0; background: #cce7d0; cursor: pointer; color: #1a1a1a; font-weight: bold; border-radius: 4px; font-size: 14px; padding: 0; display: flex; align-items: center; justify-content: center;">+</button>
                    </div>
                </td>
                <td>EGP ${itemTotal}</td>
            `;
            cartBody.appendChild(tr);
        });

        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        if (subtotalEl) subtotalEl.innerText = 'EGP ' + subtotal;
        if (totalEl) totalEl.innerText = 'EGP ' + subtotal;
    }

    renderCart();

    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
            const confirmMsg = isArabic ? 'هل أنت متأكد من رغبتك في إفراغ السلة بالكامل؟' : 'Are you sure you want to clear the entire cart?';
            
            if (confirm(confirmMsg)) {
                localStorage.removeItem('cartItems');
                updateCounts();
                renderCart();
            }
        });
    }


    cartBody.addEventListener('click', (e) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCounts();
            renderCart();
        }

        if (e.target.classList.contains('plus-btn')) {
            const index = e.target.getAttribute('data-index');
            cartItems[index].quantity += 1;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCounts();
            renderCart();
        }

        if (e.target.classList.contains('minus-btn')) {
            const index = e.target.getAttribute('data-index');
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1;
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCounts();
                renderCart();
            }
        }
    });
}

const favoritesBody = document.getElementById('favorites-body');
if (favoritesBody) {
    function renderFavorites() {
        let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
        favoritesBody.innerHTML = '';

        favoritesItems.forEach((item, index) => {
            const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
            const btnText = isArabic ? 'إضافة للسلة' : 'Add to Cart';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><i class='bx bx-x-circle remove-favorite' data-index="${index}" style="cursor: pointer; font-size: 20px;"></i></td>
                <td><img src="${item.imgSrc}" alt="" style="width: 70px;"></td>
                <td>${item.name}</td>
                <td>EGP ${item.price}</td>
                <td><button class="normal move-to-cart" data-index="${index}" style="background-color: #088178; color: #fff; padding: 8px 15px; border-radius: 4px; border: none; cursor: pointer;">${btnText}</button></td>
            `;
            favoritesBody.appendChild(tr);
        });
    }

    renderFavorites();

    const clearFavBtn = document.getElementById('clear-favorites');
    if (clearFavBtn) {
        clearFavBtn.addEventListener('click', () => {
            const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
            const confirmMsg = isArabic ? 'هل أنت متأكد من رغبتك في إفراغ قائمة المفضلة بالكامل؟' : 'Are you sure you want to clear your entire wishlist?';
            
            if (confirm(confirmMsg)) {
                localStorage.removeItem('favoritesItems');
                updateCounts();
                renderFavorites();
            }
        });
    }

    const addAllBtn = document.getElementById('add-all-to-cart');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', () => {
            let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            if (favoritesItems.length === 0) {
                const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
                alert(isArabic ? 'قائمة المفضلة فارغة!' : 'Your favorites list is empty!');
                return;
            }

            favoritesItems.forEach(favItem => {
                let existingItem = cartItems.find(c => c.name === favItem.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({ name: favItem.name, price: favItem.price, imgSrc: favItem.imgSrc, quantity: 1 });
                }
            });

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCounts();
            
            const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
            alert(isArabic ? 'تمت إضافة جميع المنتجات إلى السلة!' : 'All items added to cart!');
        });
    }



    favoritesBody.addEventListener('click', (e) => {
        let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (e.target.classList.contains('remove-favorite')) {
            const index = e.target.getAttribute('data-index');
            favoritesItems.splice(index, 1);
            localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
            renderFavorites();
        }

        if (e.target.classList.contains('move-to-cart')) {
            const index = e.target.getAttribute('data-index');
            const item = favoritesItems[index];
            
            let existingItem = cartItems.find(c => c.name === item.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ name: item.name, price: item.price, imgSrc: item.imgSrc, quantity: 1 });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCounts();
            alert('تمت إضافة المنتج إلى السلة!\nAdded to cart!');
        }
    });
}

/* --- Payment Modal Logic --- */

document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

    const cardForm = document.getElementById('cardDetailsForm');
    const mobileForm = document.getElementById('mobileWalletForm');

    const cardNumber = document.getElementById('cardNumber');
    const cardName = document.getElementById('cardName');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    const cardIcon = document.getElementById('cardIcon');
    const mobileNumber = document.getElementById('mobileNumber');

    const dynamicCardWrapper = document.getElementById('dynamicCardWrapper');
    const creditCardVisual = document.getElementById('creditCardVisual');
    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    const cardCvvDisplay = document.getElementById('cardCvvDisplay');
    const cardLogoVisual = document.getElementById('cardLogoVisual');
    const cardLogoVisualBack = document.getElementById('cardLogoVisualBack');

    if (checkoutBtn && paymentModal) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (cartItems.length === 0) {
                alert(document.body.contains(document.querySelector('[dir="rtl"]')) ? 'السلة فارغة!' : 'Your cart is empty!');
                return;
            }
            paymentModal.style.display = 'flex';
        });

        closePaymentModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });

        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) paymentModal.style.display = 'none';
        });
    }

    const paymentTriggers = document.querySelectorAll('.payment-trigger');
    paymentTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) {
                paymentModal.style.display = 'flex';
            } else {
                const isArabic = document.body.contains(document.querySelector('[dir="rtl"]')) || window.location.pathname.includes('-Arabic');
                window.location.href = isArabic ? 'cart-Arabic.html' : 'cart.html';
            }
        });
    });

    if (checkoutBtn && paymentModal) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const method = option.getAttribute('data-method');
                
                if (cardNumber) cardNumber.value = '';
                if (cardName) cardName.value = '';
                if (cardExpiry) cardExpiry.value = '';
                if (cardCVV) cardCVV.value = '';
                if (mobileNumber) mobileNumber.value = '';

                if (method === 'Visa' || method === 'MasterCard' || method === 'Vodafone Cash') {
                    if (method === 'Vodafone Cash') {
                        cardForm.style.display = 'none';
                        mobileForm.style.display = 'flex';
                        if (cardNumberDisplay) cardNumberDisplay.innerText = '010 #### ####';
                        if (cardNameDisplay) cardNameDisplay.innerText = document.body.contains(document.querySelector('[dir="rtl"]')) ? 'محفظة فودافون' : 'Vodafone Wallet';
                        if (cardExpiryDisplay) cardExpiryDisplay.innerText = 'N/A';
                    } else {
                        cardForm.style.display = 'flex';
                        mobileForm.style.display = 'none';
                        if (cardNumberDisplay) cardNumberDisplay.innerText = '#### #### #### ####';
                        if (cardNameDisplay) cardNameDisplay.innerText = document.body.contains(document.querySelector('[dir="rtl"]')) ? 'الاسم الكامل' : 'FULL NAME';
                        if (cardExpiryDisplay) cardExpiryDisplay.innerText = 'MM/YY';
                    }
                    
                    if (cardCvvDisplay) cardCvvDisplay.innerText = '';
                    if (cardIcon) {
                        cardIcon.className = 'bx bxs-credit-card';
                        cardIcon.style.color = '#ccc';
                    }

                    if (dynamicCardWrapper) dynamicCardWrapper.style.display = 'block';
                    
                    if (creditCardVisual) {
                        creditCardVisual.className = 'credit-card-visual';
                        creditCardVisual.classList.remove('flipped');
                        
                        let brandClass = method === 'Vodafone Cash' ? 'vodafone' : method.toLowerCase();
                        creditCardVisual.classList.add(brandClass);
                        
                        let logoHtml = '';
                        if (method === 'Visa') logoHtml = "<i class='bx bxl-visa'></i>";
                        else if (method === 'MasterCard') logoHtml = "<i class='bx bxl-mastercard'></i>";
                        else if (method === 'Vodafone Cash') logoHtml = "<img src='img/pay/vodafone-cash.png' style='height: 25px; object-fit: contain; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));'>";
                        
                        if (cardLogoVisual) cardLogoVisual.innerHTML = logoHtml;
                        if (cardLogoVisualBack) cardLogoVisualBack.innerHTML = logoHtml;
                    }
                } else {
                    cardForm.style.display = 'none';
                    mobileForm.style.display = 'none';
                    if (dynamicCardWrapper) dynamicCardWrapper.style.display = 'none';
                }
                validateForm();
            });
        });


        cardNumber?.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += val[i];
            }
            e.target.value = formatted;

            if (cardNumberDisplay) {
                cardNumberDisplay.innerText = formatted || '#### #### #### ####';
            }

            if (val.startsWith('4')) {
                cardIcon.className = 'bx bxl-visa';
                cardIcon.style.color = '#1a1f71';
            } else if (val.startsWith('5')) {
                cardIcon.className = 'bx bxl-mastercard';
                cardIcon.style.color = '#eb001b';
            } else {
                cardIcon.className = 'bx bxs-credit-card';
                cardIcon.style.color = '#ccc';
            }
            validateForm();
        });

        cardExpiry?.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
            if (val.length >= 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
            } else {
                e.target.value = val;
            }
            if (cardExpiryDisplay) {
                cardExpiryDisplay.innerText = e.target.value || 'MM/YY';
            }
            validateForm();
        });

        cardName?.addEventListener('input', (e) => {
            if (cardNameDisplay) {
                const isArabic = document.body.contains(document.querySelector('[dir="rtl"]'));
                cardNameDisplay.innerText = e.target.value || (isArabic ? 'الاسم الكامل' : 'FULL NAME');
            }
            validateForm();
        });

        cardCVV?.addEventListener('input', (e) => {
            if (cardCvvDisplay) {
                cardCvvDisplay.innerText = e.target.value;
            }
            validateForm();
        });
        
        cardCVV?.addEventListener('focus', () => {
            if (creditCardVisual) creditCardVisual.classList.add('flipped');
        });
        
        cardCVV?.addEventListener('blur', () => {
            if (creditCardVisual) creditCardVisual.classList.remove('flipped');
        });

        mobileNumber?.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            let formatted = '';
            for (let i = 0; i < val.length; i++) {
                if (i === 3 || i === 7) formatted += ' ';
                formatted += val[i];
            }
            
            if (cardNumberDisplay) {
                cardNumberDisplay.innerText = formatted || '010 #### ####';
            }
            validateForm();
        });

        function validateForm() {
            const activeOption = document.querySelector('.payment-option.active');
            if (!activeOption) return;

            const method = activeOption.getAttribute('data-method');
            let isValid = false;

            if (method === 'Visa' || method === 'MasterCard') {
                isValid = cardNumber.value.length === 19 && 
                          cardName.value.trim().length > 2 && 
                          cardExpiry.value.length === 5 && 
                          cardCVV.value.length === 3;
            } else {
                isValid = mobileNumber.value.length === 11;
            }

            confirmPaymentBtn.disabled = !isValid;
        }

        confirmPaymentBtn.addEventListener('click', () => {
            const isArabic = document.body.contains(document.querySelector('[dir="rtl"]'));
            const successMsg = isArabic 
                ? 'تمت العملية بنجاح! شكراً لطلبك.' 
                : 'Transaction successful! Thank you for your order.';
            
            alert(successMsg);
            localStorage.removeItem('cartItems');
            updateCounts();
            window.location.href = isArabic ? 'index-Arabic.html' : 'index.html';
        });
    }
});
