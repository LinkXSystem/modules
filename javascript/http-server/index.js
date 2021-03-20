const http = require('http');

let port = process.env.port | 4200

http.createServer(app).listen(port, () => {
    console.log(`server is listening ${port}`)
})

let num = 0;

function getData() {
    let size = 1 * 1024
    let arr = new Array(size)
    for(let i = 0; i < arr.length; i++) {
        arr[i] = 1
    }
    return arr;
}

function app(req, res) {
    // console.log(`第${num++}次访问`);
    res.end(getData().toString())
}

