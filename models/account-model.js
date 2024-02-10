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
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
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
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
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
async function updateAccount(account_id, account_firstname, account_lastname, account_email){
  try {
    //const sql = `UPDATE account SET account_firstname = '${account_firstname}', account_lastname = '${account_lastname}', account_email = '${account_email}' WHERE account_id = ${account_id}`
    return await pool.query(`UPDATE account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1`, [account_id, account_firstname, account_lastname, account_email])
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
  module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, changePassword, getAccountByID}