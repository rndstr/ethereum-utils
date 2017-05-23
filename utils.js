exports.balances = function (accounts) {
    if (typeof accounts === 'string') {
        accounts = [accounts];
    } else if (typeof accounts === 'undefined') {
        accounts = eth.accounts;
    }

    if (Array.isArray(accounts)) {
        var newaccounts = {};
        accounts.forEach(function (a, i) {
            newaccounts[i] = a;
        });
        accounts = newaccounts;
    }

    Object.keys(accounts).forEach(function (name) {
        try {
            console.log('  ' + name + ":\t" +  accounts[name] + "\tbalance: Ξ" + web3.fromWei(eth.getBalance(accounts[name]), "ether"));
        } catch (e) {
        }
    });
};

exports.send = function (from, to, ether) {
    console.log('Ξ' + ether + ' ' + from + ' >> ' + to);
    return eth.sendTransaction({
        from: from,
        to: to,
        value: web3.toWei(ether, 'ether')
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
};
