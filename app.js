// Storage Controller
const StorageCtrl = (function(){
    //Public methods
    return {
        storeItem: function(item){
            let items;
            //Check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(item);

                //re-set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            //re-set ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            //re-set ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();
//Item Controller
const ItemCtrl = (function(){
    //Item Contructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        //items: [
            // {id: 0, name:'Steak Dinner', calories: 1200},
            // {id: 1, name:'Cookie', calories: 400},
            // {id: 2, name:'Eggs', calories: 300},
        //],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return{
        getItems: function(){
            return data.items;
        }, 
        addItem: function(name, calories){
            let ID;
            //Create id
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id +1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            //Creat new Item
            newItem = new Item(ID, name, calories);

            //Add to item array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            
            //loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
             return found;
        },
        deleteItem: function(id){
            //get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });

            //set total cal in data structure
            data.totalCalories = total;

            //Return total
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();



//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    //Public methods
    return {
         populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> 
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i></a></li>`;
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `
            <strong>${item.name}: </strong> 
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = ` <strong> ${item.name}: </strong> 
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i></a>`;       
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove();
        },
         clearInput: function(){
             document.querySelector(UISelectors.itemNameInput).value = '';
             document.querySelector(UISelectors.itemCaloriesInput).value = '';
         },
         addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =  ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
         },
         removeItems: function(){
             let listItems = document.querySelectorAll(UISelectors.listItems);

             //turn Node list into Array
             listItems = Array.from(listItems);
             listItems.forEach(function(item){
                 item.remove();
             });
         },
         hideList: function(){
             document.querySelector(UISelectors.itemList).style.display = 'none';
         },
         showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
         },
         clearEditState: function(){
             UICtrl.clearInput();
             document.querySelector(UISelectors.updateBtn).style.display = 'none';
             document.querySelector(UISelectors.deleteBtn).style.display = 'none';
             document.querySelector(UISelectors.backBtn).style.display = 'none';
             document.querySelector(UISelectors.addBtn).style.display = 'inline';
         },
         showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
         getSelectors: function(){
            return UISelectors;
        }
    }
})();



//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load Event listeners
    const loadEventListeners = function(){
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.key === 'Enter')
            e.preventDefault();
            return false;
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update button event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Back button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add Item Submit
    const itemAddSubmit = function(e){
        //get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        //Check for name and calorie input
        if(input.name !== ''  && input.calories !== ''){

            //Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories to ui
            UICtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
        // Get list item id (item-0, item-1)
        const listId = e.target.parentNode.parentNode.id;
          
        // Break into an array
        const listIdArr = listId.split('-');
          
        // Get the actual id
        const id = parseInt(listIdArr[1]);
        // Get item
        const itemToEdit = ItemCtrl.getItemById(id);

        //set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        //add item to form
        UICtrl.addItemToForm();
        }
        
        e.preventDefault();
    }

    //Update submit
    const itemUpdateSubmit = function(e){
        
        //Get item input
        const input = UICtrl.getItemInput();

        //Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function(e){

        //get current irem
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
 
        
        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function(){
        //delete all items from data structure
        ItemCtrl.clearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //remove from UI
        UICtrl.removeItems();

        //clear from local ls
        StorageCtrl.clearItemsFromStorage();

        //hide UL
        UICtrl.hideList();
    }

    //Public methods
    return {
        init: function(){

        //Clear edit state / set init state
        UICtrl.clearEditState();

        //fetch items from data structure
        const items = ItemCtrl.getItems();

        //Check if any items
        if(items.length === 0){
            UICtrl.hideList();
        } else {
            UICtrl.populateItemList(items);
        }

        //populate list with items
        UICtrl.populateItemList(items);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Load event listeners
        loadEventListeners();
      }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


//Initialize App
App.init();