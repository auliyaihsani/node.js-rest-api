// load our app server using express
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser= require('body-parser')
app.use(morgan('combined'))
app.use(express.static('./view'))
app.use(bodyParser.urlencoded({extended: false}))
// handle request
app.get("/", (req, res)=>{
    console.log("respon to root route ")
    res.send("hello from root")
})
// localhost:3000
app.listen(3000, () => {
    console.log("server jalan pada port 3000")
})
function getConnection(){
    return  connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database : 'db_node_api',
        password: '',
        multipleStatements: true
    })
}

// menampilkan data variabel dalam bentuk json
// app.get("/users", (req, res)=>{
//     var users1 = {nomor_rekening : 011732021, nama: "viviyona Apriani", alamat: "bogor", nomor_telepon:087883871229}
//     let users2 = {nomor_rekening : 098211111, nama: "veranda", alamat:"jakarta", nomor_telepon:0857481289}
//     const users3 = {nomor_rekening : 01129301, nama: "gracia", alamat:"bandung", nomor_telepon:0878121198}
//     res.json([users1, users2, users3])
//     // res.send("nodemon auto update")
// })

// show database
app.get('/users', (req, res)=>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database : 'db_node_api'
    })
    const queryString = "SELECT * FROM users"
    connection.query(queryString, (err, rows,fields)=>{
        if(err) {
            // menyampaikan pesan error pada terminal
            console.log("failed query to users: "+err)
            // menyampaikan pesan internal server error pada browser
            res.sendStatus(500)
            return
        }
        console.log("fetching success")
        res.json(rows)
    })
    // res.end()
})



//  show id database
app.get('/users/:id', (req, res)=>{
    console.log("fetching data sesuai id: " + req.params.id)
   const connection= getConnection()
    // mengambil data sesuai id
    const userId = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [userId], (err, rows,fields)=>{
        if(err) {
            // menyampaikan pesan error pada terminal
            console.log("failed query to users: "+err)
            // menyampaikan pesan internal server error pada browser
            res.sendStatus(500)
            return
        }
        console.log("fetching success")
        // mencari column data
        // const users = rows.map((row)=>{
        //     return {nomor_rekening: row.nomor_rekening, nama: row.nama}
        // })
        // // res.json(users)
        res.json(rows)
    })
    // res.end()
})

// post create database

app.post('/users_create', (req,res )=>{
    console.log("create users baru")
    console.log("nomor_rekening: "+ req.body.create_nomor_rekening)
    const nomor_rekening = req.body.create_nomor_rekening
    const nama = req.body.create_nama
    const alamat = req.body.create_alamat
    const nomor_telepon = req.body.create_nomor_telepon
    const queryString = "INSERT INTO users (nomor_rekening, nama, alamat, nomor_telepon) VALUES (?, ?, ?, ?)"
    getConnection().query(queryString, [nomor_rekening, nama, alamat, nomor_telepon], (err,results, fields) => {
        if (err) {
            console.log("gagal menambahkan data " + err)
            res.sendStatus(500)
            return
        }
        console.log("berhasil menambahkan data users :", results.insertId);
        res.end()
    })
})


