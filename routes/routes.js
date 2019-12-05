var express = require('express');
var config = require('../web.config');
var CloudABISapi = require('cloudabis-sdk');
var router = express.Router();

var sess;

/*Get home page*/
router.get('/', function(req, res) {
    //SDK Call
    CloudABISapi.apiManager.GetToken(config).then((result) => {
        var response = JSON.parse(result);
        if ( !req.session.access_token ) {
            req.session.access_token = response.access_token;
            sess = req.session;
            console.log(sess);
        }
    }).catch((err) => {
        console.log(err);
    });
    res.render('index');
});

/*Get isRegister page*/
router.get('/isRegister', function(req, res) {
    res.render('IsRegister');
});

router.post('/isRegister', function(req, res) {
    let txtID = req.body.txtID;
    let CloudABISBiometricRequest = {
        config: config,
        token: sess.access_token,
        registrationID: txtID
    };
    //SDK Call
    CloudABISapi.apiManager.IsRegister(CloudABISBiometricRequest).then((result) => {
        console.log(result);
        console.log(typeof result);
        let msg = '';
        if ( result.OperationName == CloudABISapi.enumOperationName.EnumOperationName.IsRegistered 
        && result.OperationResult == CloudABISapi.cloudABISConstant.YES) {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult) + ": " + result.BestResult.ID;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/isRegister');
    }).catch((err) => {
        console.log(err);
    });
});
/**********************/

/*Get changeID page*/
router.get('/changeID', function(req, res) {
    res.render('ChangeId');
});

router.post('/changeID', function(req, res) {
    let oldID = req.body.oldID;
    let newID = req.body.newID;
    
    //Input for register
    let CloudABISBiometricRequest = {
        config: config,
        token: sess.access_token,
        RegistrationID: oldID,
        NewRegistrationID: newID
    };

    //SDK Call
    CloudABISapi.apiManager.ChangeID(CloudABISBiometricRequest).then((result) => {
        console.log(result);
        // console.log(typeof result);
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.ChangeID && result.OperationResult == CloudABISapi.cloudABISConstant.CS) {
            msg = CloudABISapi.cloudABISConstant.CS_MESSAGE;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/changeID');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/changeID');
    });
});
/**********************/

/*Get delete page*/
router.get('/deleteID', function(req, res) {
    res.render('DeleteId');
});

router.post('/deleteID', function(req, res) {
    let registrationID = req.body.deleteID;
    
    //Input for register
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: registrationID,
        token: sess.access_token
    };

    //SDK Call
    CloudABISapi.apiManager.RemoveID(CloudABISBiometricRequest).then((result) => {
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.DeleteID && result.OperationResult == CloudABISapi.cloudABISConstant.DS) {
            msg = CloudABISapi.cloudABISConstant.DS_MESSAGE;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/deleteID');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/deleteID');
    });
});
/**********************/

/*Get Register page*/
router.get('/register', function(req, res) {
    res.render('Register');
});

router.post('/register', function(req, res) {
    let registrationID = req.body.registrationID;
    
    //Input for register
    let templateXML = req.body.templateXML;
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: registrationID,
        token: sess.access_token,
        templateXML: JSON.stringify(templateXML)
    };

    //SDK Call
    CloudABISapi.apiManager.Register(CloudABISBiometricRequest).then((result) => {
        result = JSON.parse(result);
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.Register && result.OperationResult == CloudABISapi.cloudABISConstant.SUCCESS) {
            msg = 'Registration Success!';
        } else if (result.OperationName == CloudABISapi.enumOperationName.IsRegistered && result.OperationResult == CloudABISapi.cloudABISConstant.YES) {
            msg = CloudABISapi.cloudABISConstant.YES_MESSAGE;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/register');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/register');
    });
});
/**********************/

/*Get Identify page*/
router.get('/identify', function(req, res) {
    res.render('Identify');
});

router.post('/identify', function(req, res) {    
    //Input for register
    let templateXML = req.body.templateXML;
    let CloudABISBiometricRequest = {
        config: config,
        token: sess.access_token,
        templateXML: JSON.parse(JSON.stringify(templateXML))
    };

    //SDK Call
    CloudABISapi.apiManager.Identify(CloudABISBiometricRequest).then((result) => {
        let msg = '';
        if ( result.OperationName == CloudABISapi.enumOperationName.EnumOperationName.Identify 
        && result.OperationResult == CloudABISapi.cloudABISConstant.MATCH_FOUND) {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult) + ": " + result.BestResult.ID;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/identify');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/identify');
    });
});
/**********************/

/*Get Verify page*/
router.get('/verify', function(req, res) {
    res.render('Verify');
});

router.post('/verify', function(req, res) {
    let registrationID = req.body.verifyID;
    let templateXML = req.body.templateXML;
    //Input for register
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: registrationID,
        token: sess.access_token,
        templateXML: templateXML
    };

    //SDK Call
    CloudABISapi.apiManager.Verify(CloudABISBiometricRequest).then((result) => {
        console.log(result);
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.Verify && result.OperationResult == CloudABISapi.cloudABISConstant.VF) {
            msg = CloudABISapi.cloudABISConstant.VF_MESSAGE;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/verify');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/verify');
    });
});
/***********************/

/*Get Update page*/
router.get('/update', function(req, res) {
    res.render('Update');
});

router.post('/update', function(req, res) {
    let registrationID = req.body.updateID;
    let templateXML = req.body.templateXML;
    //Input for register
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: registrationID,
        token: sess.access_token,
        templateXML: templateXML
    };

    //SDK Call
    CloudABISapi.apiManager.Update(CloudABISBiometricRequest).then((result) => {
        console.log(result);
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.Update && result.OperationResult == CloudABISapi.cloudABISConstant.SUCCESS) {
            msg = 'Update Biometric Success!';
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/update');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/update');
    });
});
/************************/
/*Get Active Device page*/
router.get('/activeDevice', function(req, res) {
    res.render('ActiveDevice');
});

module.exports = router;