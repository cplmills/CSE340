const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    //return email.rowCount
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password, review_screenname FROM account WHERE account_email = $1',
      [account_email])
      console.log("login found")
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
* Return account data using id
* ***************************** */
async function getAccountByID(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password, review_screenname FROM account WHERE account_id = $1',
      [account_id])
      console.log("login found")
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account ID found")
  }
}
/* *****************************
*   Update account
* *************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email, review_screenname){
  try {
    return await pool.query(`UPDATE account SET account_firstname = $2, account_lastname = $3, account_email = $4, review_screenname = $5 WHERE account_id = $1`, [account_id, account_firstname, account_lastname, account_email, review_screenname])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change Password
* *************************** */
async function changePassword(account_password, account_id){
  try {
    const sql = `UPDATE account SET account_password = '${account_password}' WHERE account_id = ${account_id}`
    return await pool.query(sql)
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change Password
* *************************** */
async function checkExistingScreenname(review_screenname){
  try {
    const sql = "SELECT * FROM account WHERE review_screenname = $1"
    const screennameCount = await pool.query(sql, [review_screenname])
    if (screennameCount.rowCount === 0) {
      return false 
    }
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }

}  

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  updateAccount, 
  changePassword, 
  getAccountByID, 
  checkExistingScreenname
}