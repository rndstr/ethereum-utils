exports.balances = function () {
    eth.accounts.forEach(function (e, i) {
        console.log("  eth.accounts["+i+"]: " +  e + "\tbalance: Ξ" + web3.fromWei(eth.getBalance(e), "ether"));
    });
};


exports.sendAtBlock = function (from, to, ether, blockNumber) {
    console.log('Ξ' + ether + ' ' + from + ' >> ' + to + ' @' + blockNumber);
    return eth.sendTransaction({
        from: from,
        to: to,
        value: web3.toWei(ether, 'ether'),
        condition: {
            block: blockNumber
        }
    });
}

exports.startAndBid = function (name, from, ether) {
    var started = ethRegistrar.startAuction(web3.sha3(name), {from: from, gas: 100000});
    console.log(started);
    if (!started) {
        return;
    }
};
