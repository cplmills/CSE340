const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by vehicle ID view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventoryId)
  const vehicleName = data[0].inv_make + " - " + data[0].inv_model
  const content = await utilities.buildInventoryItem(data)
  let nav = await utilities.getNav()
  let reviews = await invCont.buildReviewsByInventoryId(inventoryId)
  if (reviews.length === 0) {
    reviews = `<span class="yellowNotice">Be the first to write a review</span>`
  }

  res.render("./inventory/inventoryid", {
    title: vehicleName,
    nav,
    accountData: res.locals.accountData,
    reviewList: reviews,
    content,
    invId: inventoryId
  })
}

/* ***************************
*  Build managment view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  //const inventoryId = req.params.inventoryId
  //const content = await utilities.buildManagementView()
  let   nav  = await utilities.getNav()
  const vehicleName = "Inventory Managment"
  // call function to create a select list in inventory management view
  const cats = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: vehicleName,
    nav,
    cats,
    errors: null,
  })
}

/* ***************************
*  Build Add Classification view
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
    let nav = await utilities.getNav()
    const vehicleName = "Inventory Managment: New Classification"
    res.render("./inventory/add-classification", {
      title: vehicleName,
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invResult = await invModel.setInventoryClassification(
    classification_name
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${classification_name} classification.`
    )
    let nav = await utilities.getNav()
    const content = await utilities.buildManagementView()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      content,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    res.status(501).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }
}

/* ***************************
*  Build Add Inventory view
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
    let nav = await utilities.getNav()
    let cats = await utilities.buildClassificationList()

    const titleName = "Inventory Managment: New Item"
    res.render("./inventory/add-inventory", {
      title: titleName,
      nav,
      cats,
      errors: null
    })
  }

/* ****************************************
*  Process New Inventory Item
* *************************************** */
invCont.registerInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body

  const invResult = await invModel.setInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${inv_make + ' ' + inv_model}.`
    )
    let nav = await utilities.getNav()
    const content = await utilities.buildManagementView
    let cats = await utilities.buildClassificationList()

    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      cats,
      content,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    let cats = await utilities.buildClassificationList()

    res.status(501).render("inventory/management", {
      title: "Inventory Management",
      nav,
      cats,
      content,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit Inventory by inv_id view
 * ************************** */

invCont.buildEditInventoryView = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inventoryId)
  itemData = itemData[0]
  let cats = await utilities.buildClassificationList(itemData.classification_id)
  let itemName = `${itemData.inv_make} ${itemData.inv_model}`

  const titleName = "Edit Item: " + itemName
  res.render("./inventory/edit-inventory", {
    title: titleName,
    nav,
    cats,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    // const classificationSelect = await utilities.buildClassificationList(updateResult.classification_id)
    const cats = await utilities.buildClassificationList(updateResult.classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    //classificationSelect: classificationSelect,
    cats,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  DELETE Inventory by inv_id view
 * ************************** */

invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inventoryId)
  itemData = itemData[0]
  let cats = await utilities.buildClassificationList(itemData.classification_id, true)
  let itemName = `${itemData.inv_make} ${itemData.inv_model}`

  const titleName = "Delete Item: " + itemName
  res.render("./inventory/delete-confirm", {
    title: titleName,
    nav,
    errors: null,
    cats,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  DELETE Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id 
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make
    req.flash("notice", `The Vehicle ID ${inv_id} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const cats = await utilities.buildClassificationList()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    cats,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build reviews section
 * ************************** */
invCont.buildReviewsByInventoryId = async function (inv_id, req, res, next) {
  const reviews = await invModel.getReviewsListByInventoryId(inv_id)
  // Sort reviews by date in descending order (newest review first)
  if (reviews.length === 0) {
    return []
  }
  reviews.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));

  let listItems = '';

  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

  // Loop through the sorted reviews array and generate HTML list items
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i]
    const date = new Date(review.review_date).toLocaleDateString('en-US', options);
    listItems += '<li>';
    listItems += `<B>${review.review_screenname}</B> - Written on: ${date}`
    listItems += `<p class="reviewBody"> Review: ${review.review_body}</p></li>`;
  }

  return listItems;
}

/* ****************************************
*  Process New Review for a Vehicle
* *************************************** */
invCont.postReview = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    inv_id,
    review_body,
    review_active,
    review_vehicle,
    review_screenname
  } = req.body
  const postResult = await invModel.postReview(
    account_id, inv_id, review_body, review_active, review_screenname 
  )

  if (postResult) {
    req.flash("notice", `Review Successfully Added. Thank You!`)
    res.redirect(`/inv/detail/${inv_id}`)
  }

}  

/* ***************************
 *  Build EDIT reviews section
 * ************************** */
invCont.buildEditReview = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    const review = await invModel.getReviewByReviewID(review_id)
    // Sort reviews by date in descending order (newest review first)
    if (review.length === 0) {
      return []
    }
    const isOwner = await invModel.isOwnerofReview(review_id, review.account_id)
    if (isOwner) {
      res.render("./inventory/edit-review", {
        title: "Edit Review",
        nav,
        review,
        errors: null,
      })
    } else {
      req.flash("notice", "You are not the owner of that review!")
      res.redirect("/account/")

    }
  } catch(err) {
    console.error(err)
    throw new Error("Unable to build Edit Review View. Please try again")
  }
}

/* ****************************************
*  Process review update
* *************************************** */
invCont.editReview = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      account_id,
      inv_id,
      review_body,
      review_id
    } = req.body
    const postResult = await invModel.editReview(
      account_id, inv_id, review_body, true, review_id 
    )

    if (postResult) {
      req.flash("notice", `Review Successfully Changed. Thank You!`)
      res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch(err) {
    console.error(err)
    throw new Error("Unable to process editReview. Please try again")
  }

}  

/* ***************************
 *  Build DELETE review 
 * ************************** */
invCont.buildDeleteReviewView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    const review = await invModel.getReviewByReviewID(review_id)
    // Sort reviews by date in descending order (newest review first)
    if (review.length === 0) {
      return []
    }
    res.render("./inventory/delete-review", {
      title: "Delete Review",
      nav,
      review,
      errors: null,
    })
  } catch(err) {
    console.error(err)
    throw new Error("Unable to Build Delete Review View. Please try again")
  }
}

/* ***************************
 *  DELETE Review Data
 * ************************** */
invCont.deleteReview = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    const deleteResult = await invModel.deleteReview(review_id)

    if (deleteResult) {
      req.flash("notice", `Your review was successfully deleted.`)
    } else {
      req.flash("notice", "Sorry, the delete failed.")
    }
    res.redirect("/account/")
  } catch(err) {
    console.error(err)
    throw new Error("Unable to delete review. Please try again")
  }
}
module.exports = invCont

