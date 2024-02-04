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
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
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

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, setInventoryClassification, setInventoryItem};