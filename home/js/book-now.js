// Initialize Supabase
const supabaseUrl = "https://umfamnhqjopxxtovmwsd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZmFtbmhxam9weHh0b3Ztd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTAwNTEsImV4cCI6MjA1NjQyNjA1MX0.YgT0GToWew6lP_noejWbe0FPxmVmHcc9DztbEzmInOs"; // Replace with your actual anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Get form elements
const bookingForm = document.getElementById("bookingForm");
const serviceTypeSelect = document.getElementById("serviceType");
const serviceNameSelect = document.getElementById("serviceName");
const numItemsInput = document.getElementById("numItems");
const totalPaymentInput = document.getElementById("totalPayment");
const deliveryTypeSelect = document.getElementById("deliveryType");
const addressFields = document.getElementById("deliveryAddress");

// Updated service pricing
const servicePrices = {
    "Cleaning": {
        "Deep Clean": 350,
        "Sole Unyellowing": 750
    },
    "Restoration": {
        "Full Repaint": 1200,
        "Full Outsole Reglue": 1200,
        "Full Midsole Reglue": 1500,
        "Sole Replacement": 3500,
        "Sole Stitch": 300,
        "Partial Repaint": 300,
        "Partial Reglue": 400
    }
};

// Populate service names based on selected service type
serviceTypeSelect.addEventListener("change", function () {
    const selectedType = this.value;
    serviceNameSelect.innerHTML = '<option value="">-- Select --</option>'; // Reset options

    if (selectedType && servicePrices[selectedType]) {
        Object.keys(servicePrices[selectedType]).forEach(service => {
            const option = document.createElement("option");
            option.value = service;
            option.textContent = service;
            serviceNameSelect.appendChild(option);
        });
    }
});

// Calculate total payment
function calculateTotal() {
    const serviceType = serviceTypeSelect.value;
    const serviceName = serviceNameSelect.value;
    const numItems = parseInt(numItemsInput.value, 10);

    if (serviceType && serviceName && numItems > 0) {
        const pricePerItem = servicePrices[serviceType][serviceName] || 0;
        totalPaymentInput.value = `₱${pricePerItem * numItems}`;
    } else {
        totalPaymentInput.value = "₱0";
    }
}

numItemsInput.addEventListener("input", calculateTotal);
serviceNameSelect.addEventListener("change", calculateTotal);

// Toggle delivery address fields
deliveryTypeSelect.addEventListener("change", function () {
    if (this.value === "Door to Door") {
        addressFields.style.display = "block";
    } else {
        addressFields.style.display = "none";
    }
});

// Submit form data to Supabase
async function submitBooking(event) {
    event.preventDefault();

    const formData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        contact_number: document.getElementById("contactNumber").value,
        email: document.getElementById("email").value,
        service_type: serviceTypeSelect.value,
        service_name: serviceNameSelect.value,
        shoe_brand_model: document.getElementById("shoeBrandModel").value,
        num_items: parseInt(numItemsInput.value, 10),
        total_payment: parseFloat(totalPaymentInput.value.replace("₱", "")),
        payment_method: document.getElementById("paymentMethod").value,
        delivery_type: deliveryTypeSelect.value,
        street: document.getElementById("street")?.value || "",
        city: document.getElementById("city")?.value || "",
        postal_code: document.getElementById("postalCode")?.value || "",
        message: document.getElementById("message").value,
        agree_to_terms: document.getElementById("agreeToTerms").checked
    };

    if (!formData.agree_to_terms) {
        alert("You must agree to the terms and conditions.");
        return;
    }

    const { data, error } = await supabase.from("bookings").insert([formData]);

    if (error) {
        console.error("Error:", error.message);
        alert("Booking failed. Please try again.");
    } else {
        alert("Booking successful!");
        bookingForm.reset();
        totalPaymentInput.value = "₱0"; // Reset payment field
    }
}

// Attach submit event listener
bookingForm.addEventListener("submit", submitBooking);
