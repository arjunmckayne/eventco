const express = require('express');
const EventModel = require('../commonModels/eventModel');
const event = new express.Router();
event.get('/programHome', async (req, res) => {
    try {
        EventModel.find({
                "boosted": true
            },
            (err, data) => {
                if (err)
                    throw err
                else {
                    if (data.length <= 0)
                        responseSend(
                            res, 404, {
                                status: 404,
                                message: "No Active Programs"
                            }
                        )
                    else {
                        let dataArray = [];
                        data.forEach((dum) => {
                            let temp = {
                                eventId: dum.eId,
                                eventName: dum.name,
                                imgPath: (dum.img) ? dum.img : '',
                                city: (dum.location.city) ? dum.location.city : 'NA',
                            }
                            dataArray.push(temp);
                        });
                        responseSend(
                            res, 200, {
                                programData: dataArray
                            })
                    }
                }
            }).sort({
            "createdDate": -1
        })
    } catch (err) {
        responseSend(
            res, 500, {
                status: 500,
                message: err.message
            });
    }
});
event.post('/eventCreation', async (req, res) => {
    try {
        if (!req.body.eventDate || !req.body.name || !req.body.eventTime || req.body.eventDate === '' || req.body.eventDate === null ||
            req.body.name === null || req.body.name === '' ||
            req.body.eventTime === null || req.body.eventTime === ''
        )
            throw {
                code: 500,
                msg: "Oops Something went wrong"
            }
        let eventData = new EventModel({
            eId: await geteventId(),
            name: req.body.name,
            "description.eventDate": req.body.eventDate,
            "description.eventTime": req.body.eventTime,
            "description.type": req.body.categoryType,
            "description.endDate": req.body.endDate ? req.body.endDate : '',
            "description.endTime": req.body.endTime ? req.body.endTime : '',
            createdBy: req.body.userId
        });
        eventData.save((err, data) => {
            if (err)
                throw {
                    code: 304,
                    msg: err.message
                }
            responseSend(res, 200, {
                status: "Successfully Created the Event",
                eventId: data.eId
            });
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
});
event.put('/eventUpdate', async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.eventId || !req.body.longitude || req.body.longitude === '' || req.body.longitude === null || !req.body.latitude || req.body.latitude === '' || req.body.latitude === null)
            throw {
                code: 500,
                msg: "Oops Something went wrong"
            }
        EventModel.updateMany({
            eId: req.body.eventId,
            createdBy: req.body.userId
        }, {
            $set: {
                "location.longitude": req.body.longitude,
                "location.latitude": req.body.latitude,
                "location.city": req.body.city ? req.body.city : null,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Event " + req.body.eventId
                }) :
                responseSend(res, 200, {
                    status: "Updated Successfully for the Event " + req.body.eventId,
                    eventId: req.body.eventId
                });
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
});
event.put('/eventUpdateType', async (req, res) => {
    try {
        if (!req.body || !req.body.eventId || !req.body.eventId === '' || !req.body.userId || req.body.userId === '' || !req.body.type || req.body.type === '')
            throw {
                code: 500,
                msg: "Oops Something went wrong"
            }
        EventModel.updateMany({
            eId: req.body.eventId,
            createdBy: req.body.userId
        }, {
            $set: {
                "description.type": req.body.type,
                "description.subCat": req.body.subCat ? req.body.subCat : null,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            if (err)
                console.log(err, "------Error Occured")
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Event " + req.body.eventId,
                }) : responseSend(res, 200, {
                    status: "Updated Successfully for the Event " + req.body.eventId,
                    eventId: req.body.eventId
                });
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
});
event.get('/trending', async (req, res) => {
    try {
        let crntDate = await getCrntDate();
        console.log(crntDate)
        EventModel.find({
                "description.eventDate": crntDate
            },
            (err, data) => {
                if (err)
                    throw {
                        code: 304,
                        msg: err.message

                    }
                else {
                    if (data.length <= 0)
                        responseSend(
                            res, 404, {
                                status: 404,
                                message: "No Active Programs"
                            }
                        )
                    else {
                        let dataArray = [];
                        data.forEach((dum) => {
                            let temp = {
                                eventId: dum.eId,
                                eventName: dum.name,
                                imgPath: (dum.img) ? dum.img : '',
                            }
                            dataArray.push(temp);
                        });
                        responseSend(
                            res, 200, {
                                trendingData: dataArray
                            })
                    }
                }
            }).sort({
            "createdDate": -1
        })

    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
})
event.get('/real', async (req, res) => {
    try {
        let crntDate = await getCrntDate();
        console.log(crntDate)
        EventModel.find({
                "description.type": "Wedding"
            },
            (err, data) => {
                if (err)
                    throw {
                        code: 304,
                        msg: err.message

                    }
                else {
                    if (data.length <= 0)
                        responseSend(
                            res, 404, {
                                status: 404,
                                message: "No Active Wedding"
                            }
                        )
                    else {
                        let dataArray = [];
                        data.forEach((dum) => {
                            let temp = {
                                eventId: dum.eId,
                                imgPath: (dum.img) ? dum.img : '',
                            }
                            dataArray.push(temp);
                        });
                        responseSend(
                            res, 200, {
                                realData: dataArray
                            })
                    }
                }
            }).sort({
            "createdDate": -1
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
})
event.get('/feature', async (req, res) => {
    try {
        let crntDate = await getCrntDate();
        console.log(crntDate)
        EventModel.find({
                "video.isFeatured": true
            },
            (err, data) => {
                if (err)
                    throw {
                        code: 304,
                        msg: err.message
                    }
                else {
                    if (data.length <= 0)
                        responseSend(
                            res, 404, {
                                status: 404,
                                message: "No feature Videos"
                            }
                        )
                    else {
                        let dataArray = [];
                        data.forEach((dum) => {
                            let temp = {
                                eventId: dum.eId,
                                eventName: dum.name,
                                videoPath: dum.video.path ? dum.video.path : '',
                                city: (dum.location.city) ? dum.location.city : 'NA',
                            }
                            dataArray.push(temp);
                        });
                        responseSend(
                            res, 200, {
                                FeaturedVideo: dataArray
                            })
                    }
                }
            }).sort({
            "createdDate": -1
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
});

event.put('/updateImg', async (req,res)=>{
    
})

getCrntDate = async () => {
    let date = (new Date().getDate()).toString() + "/" + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()).toString() + "/" + (new Date().getFullYear()).toString();
    return date

}
geteventId = async () => {
    const val = await EventModel.findOne({}).sort({
        createdDate: -1
    });
    if (val) {
        return (val.eId != null || val.eId != NaN || val.eId != undefined) ?
            "e" + (parseInt(val.eId.split("e")[1]) + 1) :
            "e1"
    }
    return "e1"
}

function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = event;