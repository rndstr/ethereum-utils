console.log('-- loading utils.js');

var _ = _ || {};

_.balances = function () {
    eth.accounts.forEach(function (e, i) {
        console.log("  eth.accounts["+i+"]: " +  e + "\tbalance: Ξ" + web3.fromWei(eth.getBalance(e), "ether"));
    });
};


_.sendAtBlock = function (from, to, ether, blockNumber) {
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
