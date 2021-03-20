const koa = require('koa');

const app = koa();
const PORT = 4200;
app.port = process.env.PORT || PORT;

function getData() {
    let size = 1 * 1024
    let arr = new Array(size)
    for(let i = 0; i < arr.length; i++) {
        arr[i] = 1
    }
    return arr;
}

app.use(function*() {
    this.body = getData();
});

app.listen(app.port, () => {
    console.log(`koa server is listening:`, app.port);
});