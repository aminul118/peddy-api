const loadCategories = () => {
    showLoading();

    const hideSpinnerDelay = setTimeout(() => {
        hideLoading();
    }, 2000);

    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => {
            displayCategories(data.categories);
            clearTimeout(hideSpinnerDelay);
            hideLoading();
        })
        .catch(error => {
            console.log(error);
            clearTimeout(hideSpinnerDelay);
            hideLoading();
        });
};

const displayCategories = (data) => {
    const categoryContainer = document.getElementById('category-container');
    data.forEach(item => {
        // console.log(item)
        const div = document.createElement('div');
        div.innerHTML = `
        <button id="btn-${item.category}" onclick="loadCategoriesPets('${item.category}')"
        class="gap-2 py-3 flex justify-center items-center border w-40 rounded-full font-bold text-xl remove-button-color">
        <img class="w-10 " src="${item.category_icon}" alt="">${item.category} 
        </button>
        `
        categoryContainer.append(div)
    })
}

//! Categories Button Handler
const loadCategoriesPets = (category) => {
    showLoading();
    const hideSpinnerDelay = setTimeout(() => {
        hideLoading();
    }, 2000);

    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            const activeBtn = document.getElementById(`btn-${category}`);
            activeBtn.classList.add("active-btn");
            displayPets(data.data);
            clearTimeout(hideSpinnerDelay); // Clear timeout if data is fetched before 2 seconds
            hideLoading(); // Hide loading spinner immediately after data is fetched
        })
        .catch(error => {
            console.log(error);
            clearTimeout(hideSpinnerDelay);
            hideLoading();
        });
};

//! Button Color Remove by function
const removeActiveClass = () => {
    const button = document.getElementsByClassName('remove-button-color');
    for (let btn of button) {
        btn.classList.remove('active-btn')
    }
}

// ! Load Pets form API call
const loadPets = async (sortByPrice = false) => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await response.json();
        // Sort pets by price if sortByPrice is true
        const pets = sortByPrice
            ? data.pets.sort((a, b) => (b.price || 0) - (a.price || 0)) // Sort in descending order
            : data.pets; // Keep original order

        displayPets(pets);
    } catch (error) {
        console.error(error);
        alert('Failed to load pets. Please try again.');
    }
};

// Display Pets
const displayPets = (pets) => {
    const petsContainer = document.getElementById('pets-container');
    const gridHide = document.getElementById('pets-grid-section');
    const noContent = document.getElementById('no-content');
    petsContainer.innerHTML = "";
    if (pets.length === 0) {
        gridHide.classList.add('hidden');
        noContent.innerHTML = `
            <div class="flex flex-col justify-center items-center py-8 lg:py-32 border rounded-lg my-4 ">
                <img src="./images/error.webp" alt="No pets">
                <h3 class="text-2xl font-semibold text-center">No pets found in this category</h3>
            </div>
        `;
        noContent.classList.remove('hidden');
        return;
    } else {
        gridHide.classList.remove('hidden');
        noContent.classList.add('hidden');
    }

    pets.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="border rounded-lg p-4 ">
                <img class="rounded-lg mb-2 w-full object-cover md:h-44 2xl:h-96" src="${item.image}" alt="">
                <h3 class="text-xl font-semibold">${item.pet_name}</h3>
                <p class="flex items-center gap-2"><img class="w-5" src="./images/breed.jpg" alt=""> Breed: 
                    ${item.breed || "Not Available"}</p>
               <p class="flex items-center gap-2"><img class="w-5" src="./images/birth.jpg" alt=""> Birth:
                 ${item.date_of_birth ? new Date(item.date_of_birth).getFullYear() : "Not Available"}</p>
                 <p class="flex items-center gap-2"><img class="w-5" src="./images/gender.jpg" alt="">
                    Gender: ${item.gender ? item.gender : "Not Available"}</p> 
                <p class="flex items-center gap-2"><img class="w-5" src="./images/price.jpg" alt=""> Price: 
                    ${item.price == null ? "Not Available" : item.price} $</p>
                <div class="divider"></div>
                <div class="flex gap-2 ">
                    <button onclick="thumbsUpButtonHandler('${item.pet_name}','${item.image}')"><i class="fa-solid fa-thumbs-up text-2xl border-2 px-3 py-2 rounded-lg hover:bg-[#0e7a81] hover:text-white   "></i></button>
                    <button id="adopt-btn-${item.pet_name}" onclick="adoptPet(this)" class="font-bold text-[#0e7a81] border-2 px-3 rounded-lg hover:bg-[#0e7a81] hover:text-white ">Adopt</button>
                    <button onclick="loadDetails('${item.pet_name.replace(/'/g, "\\'")}', '${item.image}', '${item.breed}', '${item.date_of_birth}', '${item.gender}', '${item.price}', '${item.pet_details.replace(/'/g, "\\'")}')" class="font-bold text-[#0e7a81] border-2 px-3 rounded-lg hover:bg-[#0e7a81] hover:text-white">Details</button>
                </div>
            </div>       
        `;
        petsContainer.append(div);
    });
};


// Add event listener for the sort by price button
document.getElementById('sort-by-price').addEventListener('click', () => {
    loadPets(true); // Call loadPets with sortByPrice set to true
});

const adoptPet = (button) => {
    const modalContainer = document.getElementById('modal-container');
    const modal = document.getElementById('customModal');
    modalContainer.innerHTML = `
        <h3 class="text-2xl font-bold text-center mb-4">Congrats! </h3>
        <p class="text-xl font-semibold text-center" >Adoption starting in </p>
        <h1 id="countdown" class="text-center font-bold text-4xl">3</h1>
    `;

    modal.showModal();

    let countdown = 3;
    const interval = setInterval(() => {
        if (countdown > 1) {
            document.getElementById('countdown').textContent = `${--countdown}`;
        } else {
            clearInterval(interval);
            button.textContent = "Adopted";
            button.classList.add("text-red-400");
            button.disabled = true;
            modal.close();
        }
    }, 1000);
};

// Modal Display Function
const loadDetails = (petName, petImage, breed, dateOfBirth, gender, price, information) => {
    console.log(information)

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
     <div>
        <img class="rounded-lg mb-2 w-full h-full object-cover " src="${petImage}" alt="${petName}">
        <h3 class="text-2xl font-bold">${petName}</h3>
        <div class="grid grid-cols-2 text-left">
            <p class="flex items-center gap-1"><img class="w-4 h-4" src="./images/breed.jpg" alt=""><strong> Breed:</strong> ${breed !== "undefined" ? breed : "Not Available"}</p>
            <p class="flex items-center gap-1"><img class="w-4 h-4" src="./images/birth.jpg" alt=""><strong>Birth:</strong> ${dateOfBirth && !isNaN(Date.parse(dateOfBirth)) ? new Date(dateOfBirth).getFullYear() : "Not Available"}</p>
            <p class="flex items-center gap-1 "><img class="w-4 h-4" src="./images/gender.jpg" alt=""> <strong>Gender:</strong> ${gender}</p>
            <p class="flex items-center gap-1 "><img class="w-4 h-4" src="./images/price.jpg" alt=""><strong>Price:</strong>${price !== "null" ? price + ' $' : "Not Available"} </p>
        </div>
            <p class="mt-2 text-xl font-semibold">Details:</p>
            <p>${information}</p>
    </div>
       `
    const modal = document.getElementById('customModal');
    modal.showModal();
}

// Thumbs up button handler
const thumbsUpButtonHandler = (petName, petImage) => {
    const thumbsUpContainer = document.getElementById('thumbs-up-container');

    const div = document.createElement('div');
    div.classList.add("border", "rounded-lg",);

    div.innerHTML = `
        <img class="rounded-lg mb-2 w-full h-full object-cover p-2 " src="${petImage}" alt="${petName}">
           `;
    thumbsUpContainer.append(div);

};

// Loading Spinner and hiding
const showLoading = () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.remove('hidden'); // Show the spinner
};

const hideLoading = () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.add('hidden'); // Hide the spinner
};

loadCategories()
loadPets()