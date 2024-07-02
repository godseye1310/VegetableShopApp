const vegName = document.getElementById("vegname");
const vegPrice = document.getElementById("vegprice");
const vegQty = document.getElementById("vegqty");
const veggiesLists = document.getElementById("VegLists");

const totalveggies = document.getElementById("total");

//Handle Add to Vegetable Shop Submit
function handleAddVegtoShop(event) {
	event.preventDefault();

	let veggiesData = {
		theVegName: vegName.value,
		theVegPrice: vegPrice.value,
		theVegQty: vegQty.value,
	};

	axios
		.post(
			"https://crudcrud.com/api/03f96ed343be47b785947b9ebaef2a50/vegShopData",
			veggiesData
		)
		.then((response) => {
			displayVeggiesList(response.data);
			console.log(response);
		})
		.catch((error) => console.log(error));

	vegName.value = "";
	vegPrice.value = "";
	vegQty.value = "";
}

//Display Veg Lists on Page Refresh
window.addEventListener("DOMContentLoaded", () => {
	axios
		.get(
			"https://crudcrud.com/api/03f96ed343be47b785947b9ebaef2a50/vegShopData"
		)
		.then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				displayVeggiesList(response.data[i]);
			}
		})
		.catch((error) => console.log(error));
});

//Create & Display Vegetable Lists on Screen
function displayVeggiesList(vegObj) {
	const vegList = document.createElement("li");
	vegList.className = "vlist";
	veggiesLists.appendChild(vegList);

	const vegDataDiv = document.createElement("div");
	vegDataDiv.innerHTML = `<span class="me-3">${vegObj.theVegName}</span> <span  class="me-3"><strong>₹</strong>${vegObj.theVegPrice}</span>   <span>${vegObj.theVegQty}<strong>KG</strong></span>`;
	vegList.appendChild(vegDataDiv);

	const btnDiv = document.createElement("div");
	btnDiv.classList.add("btn-group", "gap-1", "ms-2");
	vegList.appendChild(btnDiv);

	const buyVal = document.createElement("input");
	buyVal.type = "number";
	buyVal.classList.add("form-control");
	btnDiv.appendChild(buyVal);

	const buybtn = document.createElement("button");
	buybtn.type = "button";
	buybtn.classList.add("btn", "btn-outline-success");
	buybtn.innerText = "Buy";
	btnDiv.appendChild(buybtn);

	buybtn.addEventListener("click", () => {
		// console.log(buyVal.value);
		vegDataDiv.innerHTML = `<span class="me-3">${
			vegObj.theVegName
		}</span> <span  class="me-3"><strong>₹</strong>${
			vegObj.theVegPrice
		}</span>   <span>${
			vegObj.theVegQty - buyVal.value
		}<strong>KG</strong></span>`;

		let buyqty = vegObj.theVegQty - buyVal.value;
		vegObj.theVegQty = buyqty;

		axios
			.put(
				"https://crudcrud.com/api/03f96ed343be47b785947b9ebaef2a50/vegShopData/" +
					vegObj._id,
				{
					theVegName: vegObj.theVegName,
					theVegPrice: vegObj.theVegPrice,
					theVegQty: buyqty.toString(),
				}
			)
			.then((response) => console.log(response.status))
			.catch((error) => console.log(error));
	});

	const deletebtn = document.createElement("button");
	deletebtn.type = "button";
	deletebtn.classList.add("btn", "btn-outline-danger", "btn-sm");
	deletebtn.innerText = "Delete";
	btnDiv.appendChild(deletebtn);

	deletebtn.addEventListener("click", () => {
		veggiesLists.removeChild(vegList);
		totalveggies.innerHTML = `${
			document.getElementsByClassName("vlist").length
		}`;

		axios
			.delete(
				"https://crudcrud.com/api/03f96ed343be47b785947b9ebaef2a50/vegShopData/" +
					vegObj._id
			)
			.then((response) => console.log(response.status))
			.catch((error) => console.log(error));
	});

	totalveggies.innerHTML = `${document.getElementsByClassName("vlist").length}`;
}
