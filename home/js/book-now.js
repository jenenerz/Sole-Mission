// Initialize Supabase
const supabaseUrl = "https://umfamnhqjopxxtovmwsd.supabase.co";
const supabaseKey = "your-supabase-anon-key"; // Replace with your actual anon key
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

// Function to update service names based on selected service type
function updateServiceNames() {
    serviceNameSelect.innerHTML = '<option value="">-- Select --</option>'; // Reset options

    let serviceOptions = [];

    if (serviceTypeSelect.value === "Cleaning") {
        serviceOptions = ["Deep Clean", "Sole Unyellowing"];
    } else if (serviceTypeSelect.value === "Restoration") {
        serviceOptions = [
            "Full Repaint",
            "Full Outsole Reglue",
            "Full Midsole Reglue",
            "Sole Replacement",
            "Sole Stitch",
            "Partial Repaint",
            "Partial Reglue"
        ];
    }

    serviceOptions.forEach(service => {
        const option = document.createElement("option");
        option.value = service;
        option.textContent = service;
        serviceNameSelect.appendChild(option);
    });

    calculateTotal(); // Reset total when service type changes
}

// Calculate total payment
function calculateTotal() {
    const serviceType = serviceTypeSelect.value;
    const serviceName = serviceNameSelect.value;
    const numItems = parseInt(numItemsInput.value, 10) || 0;

    if (serviceType && serviceName && numItems > 0) {
        const pricePerItem = servicePrices[serviceType][serviceName] || 0;
        totalPaymentInput.value = `₱${pricePerItem * numItems}`;
    } else {
        totalPaymentInput.value = "₱0";
    }
}

// Event Listeners
serviceTypeSelect.addEventListener("change", updateServiceNames);
serviceNameSelect.addEventListener("change", calculateTotal);
numItemsInput.addEventListener("input", calculateTotal);

// Toggle delivery address fields
deliveryTypeSelect.addEventListener("change", function () {
    addressFields.style.display = this.value === "Door to Door" ? "block" : "none";
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
