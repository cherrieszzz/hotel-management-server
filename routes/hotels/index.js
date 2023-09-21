const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');

router.get('/', async function(req, res) {
    try {
        if(!req.query.input) {
            const allHotels = await Hotel.find({});
            return res.send(allHotels);
        }
        const input = req.query.input;
        const SearchedHotels = await Hotel.find({$or: [{name:input },{city:input},{province:input},{county:input}]});
        if(!SearchedHotels || SearchedHotels.length === 0) {
            return res.send({
                message:'没有结果'
            })
        }
        return res.send(SearchedHotels);
    } catch (e) {
        return res.send({
            message:"server error"
        })
    }
});

router.get('/:_id', async (req, res) => {
    console.log("/:id")
    try {
        const doc = await  Hotel.findById(req.params._id);
        res.send(doc)
    } catch (err) {
        res.send(err)
    }
})

router.post('/', isAdminMiddleware, async (req, res) => {
    try {
        const newHotel = {
            name:req.body.name,
            city:req.body.city,
            address:req.body.address,
            starRating:req.body.starRating,
            isOpen:req.body.isOpen,
            rooms:req.body.rooms,
            image:req.body.image
        }
        console.log(newHotel);
        await Hotel.create(newHotel);
        res.send({
            message:"success!"
        })
    } catch (err) {
        res.send(err)
    }
})

router.put('/:_id', isAdminMiddleware,async (req, res) => {
    try {
            const updateHotel = {
                name:req.body.name,
                city:req.body.city,
                address:req.body.address,
                starRating:req.body.starRating,
                isOpen:req.body.isOpen,
                rooms:req.body.rooms,
                image:req.body.image
            }
            const resDoc = await Hotel.findByIdAndUpdate(req.params._id, updateHotel);
            res.send(resDoc);
    } catch (e) {
            res.send(e);
    }
})

router.delete('/:_id',isAdminMiddleware, async (req, res) => {
    try {
         await Hotel.findByIdAndDelete(req.params._id);
         res.send({
             message:"success"
         })
    } catch (e) {
        res.send(e)
    }
})

module.exports = router;