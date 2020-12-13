function make_withdraw_100() {
    let balance = 100;
    return amount => {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    };
}
const new_withdraw = make_withdraw_100();

new_withdraw(60);
new_withdraw(60);
