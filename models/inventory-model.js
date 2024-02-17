const pool = require("../database/")
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items by inventory_id
 * ************************** */
async function getInventoryByInventoryId(invid) {
  try {
    invid = parseInt(invid)
    const data = await pool.query(
      `SELECT * FROM inventory i WHERE i.inv_id = $1`,
      [invid]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/* ***************************
 *  Create a new inventory classification
 * ************************** */
async function setInventoryClassification(classification) {
  try {
    const data = await pool.query(
      `INSERT INTO classification (classification_name) VALUES ($1)`,
      [classification]
    )
    return data.rows
  } catch (error) {
    console.error("SetInventoryClassification error " + error)
  }
}

/* ***************************
 *  Create a new inventory item
 * ************************** */
async function setInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ) {
  try {
    let myQuery = `INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
    const data = await pool.query(
      myQuery,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, parseFloat(inv_price), parseInt(inv_miles), inv_color, classification_id ]
    )
    return data.rows
  } catch (error) {
    console.error("SetInventoryItem error " + error)
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    console.log(sql)
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Model error: " + error)
  }
}

/* ***************************
 *  Retrieve Reviews for Inventory 
 * ************************** */
async function getReviewsListByInventoryId(inv_id) {
  try {
    const sql = "SELECT r.account_id, r.review_date, r.review_body, r.review_active, r.review_vehicle, a.account_firstname, a.review_screenname FROM reviews r INNER JOIN account a ON r.account_id = a.account_id WHERE review_vehicle = $1";

    // Assuming you're using async/await
    const reviewsResult = await pool.query(sql, [inv_id]);
    const reviews = reviewsResult.rows;
    
    return reviews;

  } catch (error) {
    console.error("Error Retrieving Reviews: " + error)
  }
}

/* ***************************
 *  Post a new review
 * ************************** */
async function postReview(account_id, inv_id, review_body, review_active=true) {
  try {
    const today = new Date().toDateString()
    let myQuery = `INSERT INTO reviews (account_id, review_date, review_body, review_active, review_vehicle ) VALUES ($1, $2, $3, $4, $5)`
    const data = await pool.query(
      myQuery,
      [account_id, today, review_body, review_active=true, inv_id ]
    )
    return data.rows
  } catch (error) {
    console.error("PostReview error " + error)
  }
}

/* ***************************
 *  Get reviews by account ID
 * ************************** */
async function getReviewsByAccountID(account_id) {
  try {
    let myQuery = `SELECT r.review_id, r.review_date, r.review_active, i.inv_make, i.inv_model, i.inv_year, i.inv_id FROM reviews r INNER JOIN inventory i ON r.review_vehicle = i.inv_id WHERE r.account_id = $1`
    const data = await pool.query(
      myQuery,
      [account_id]
    )
    return data
  } catch (error) {
    console.error("Get Reviews error " + error)
  }
}

/* ***************************
 *  Get reviews by REVIEW_ID
 * ************************** */
async function getReviewByReviewID(review_id) {
  try {
    let myQuery = `SELECT r.review_id, r.review_body, a.review_screenname, a.account_id, r.review_date, r.review_active, i.inv_make, i.inv_model, i.inv_year, i.inv_id FROM reviews r INNER JOIN inventory i ON r.review_vehicle = i.inv_id INNER JOIN account a ON r.account_id = a.account_id WHERE r.review_id = $1 LIMIT 1`
    const data = await pool.query(
      myQuery,
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("Get Review by REVIEW ID error " + error)
  }
}

/* ***************************
 *  Edit a review
 * ************************** */
async function editReview(account_id, inv_id, review_body, review_active=true, review_id) {
  try {
    const today = new Date().toDateString()
    let myQuery = `UPDATE reviews SET account_id=$1, review_date=$2, review_body=$3, review_active=$4, review_vehicle=$5 WHERE review_id = $6`
    const data = await pool.query(
      myQuery,
      [account_id, today, review_body, review_active, inv_id, review_id ]
    )
    return data.rows
  } catch (error) {
    console.error("PostReview error " + error)
  }
}

/* ***************************
 *  Delete a Review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1"
    console.log(sql)
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("Delete Review error: " + error)
  }
}

/* ***************************
 *  Check review owner
 * ************************** */
async function isOwnerofReview(res, req, review_id, account_id) {
  try {

    const sql = "SELECT COUNT(*) FROM reviews WHERE review_id = $1 and account_id = $2"
    console.log(sql)
    const data = await pool.query(sql, [review_id, res.locals.accountData.account_id])
    const count = parseInt(data.rows[0].count)
    if (count > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Check Review Owner error: " + error)
  }
}


module.exports = {
  getClassifications,  
  getInventoryByClassificationId, 
  getInventoryByInventoryId, 
  setInventoryClassification, 
  setInventoryItem, 
  updateInventory, 
  deleteInventory,
  getReviewsListByInventoryId,
  postReview,
  getReviewsByAccountID,
  editReview,
  getReviewByReviewID,
  deleteReview,
  isOwnerofReview
};

