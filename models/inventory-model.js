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
    console.log(data.rows)
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
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("SetInventoryClassification error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId};