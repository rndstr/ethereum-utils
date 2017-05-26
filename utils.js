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
    var tx eth.sendTransaction({
        from: from,
        to: to,
        value: web3.toWei(ether, 'ether')
    });

    logtx(tx);
    return true;
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

exports.ens = {};

exports.ens.start = function (from, name, ether, secret) {
    var txavail = ethRegistrar.entries(web3.sha3(name))[0];
    console.log('bid Ξ' + ether + ' for ' + name + '.eth from ' + from + ' with secret="' + secret + '"');
    console.log('http://registrar.ens.domains/#' + name);

    if (txavail != 0 && txavail != 1) {
        throw new Error(name + ' not available: ' + txavail);
    }

    if (name == 0) { // start auction
        console.log('-- startAuction');
        var start = ethRegistrar.startAuction(web3.sha3(name), {from: from, gas: 100000});
        logtx(start);
        if (!istx(start)) {
            throw new Error('startAuction failed');
        }
    }

    console.log('-- shaBid');
    var sha = ethRegistrar.shaBid(web3.sha3(name), from, web3.toWei(ether, 'ether'), web3.sha3(secret));
    console.log(sha)

    console.log('-- newBid');
    var txbid = ethRegistrar.newBid(sha, {from: from, value: web3.toWei(ether + 0.01, 'ether'), gas: 500000});
    logtx(txbid);

    return true;
};

exports.ens.reveal = function (from, name, ether, secret) {
    console.log('reveal bid Ξ' + ether + ' for ' + name + '.eth from ' + from + ' with secret="' + secret + '"');
    return ethRegistrar.unsealBid(web3.sha3(name), web3.toWei(ether, 'ether'), web3.sha3(secret), {from: from, gas: 500000});
};

exports.ens.finalize = function (from, name) {
    console.log('finalize bid for ' + name + ' from ' + from);

    console.log('-- finalizeAuction');
    var txfin = ethRegistrar.finalizeAuction(web3.sha3(name), {from: from, gas: 500000});
    logtx(txfin);
    if (!istx(txfin)) {
        throw new Error('finalizeAuction failed');
    }

    console.log('-- setResolver');
    var txres = ens.setResolver(namehash(name + '.eth'), publicResolver.address, {from: from});
    logtx(txres);
    if (!istx(txres)) {
        throw new Error('setResolver failed');
    }

    console.log('-- setAddr');
    var txaddr = publicResolver.setAddr(namehash('somename.eth'), eth.accounts[0], {from: eth.accounts[0]})
    logtx(txaddr);
    if (!istx(txaddr)) {
        throw new Error('setAddr failed');
    }

    return true;
};



function istx(a) {
    return typeof a === 'string';
}

function logtx(tx) {
    console.log(tx);
    if (!istx(tx)) {
        return;
    }
    console.log('https://etherscan.io/tx/' + tx);
}

