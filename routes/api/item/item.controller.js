const jwt = require('jsonwebtoken');
const Item = require('../../../models/item');
const User = require('../../../models/user');
const faker = require('faker');

// exports.faker = async (req, res) => {
//     const boolArray = ["true","false",];
//     const situationArray = ["일상","오피스","예술문화",
//         "스포츠","파티",];
//     const categoryArray = ["상의","하의","아우터",
//         "가방",];
//     await Item.truncate();
//     for(let i=0;i<100;i++){
//         const name = faker.name.firstName();
//         const brand = faker.name.lastName();
//         const coin = Math.floor(Math.random() * 10) + 1;
//         const star = Math.floor(Math.random() * 6);
//         const situation = Math.floor(Math.random() * 5);
//         const category = Math.floor(Math.random() * 4);
//         const material = "면 100%";
//         const color = colorArray[Math.floor(Math.random() * 7)];
//         const onSale = boolArray[Math.floor(Math.random() * 2)];
//         const sex = boolArray[Math.floor(Math.random() * 2)];
//         const cleaning =  {
//           method: "미정",
//           temperature: 29,
//           dry: "미정",
//           store: "미정",
//         };
//         const afterService = {
//           director: "미정",
//           phone: faker.phone.phoneNumber(),
//         };
//         const manufacture = {
//           date: "0000-00-00",
//           country: faker.address.country(),
//           provider: faker.name.findName(),
//         };
//         const images = [];
//         images.push(faker.image.imageUrl());
//         images.push(faker.image.imageUrl());
//         images.push(faker.image.imageUrl());
//         const remain = Math.floor(Math.random() * 1000);
//         const reservation = Math.floor(Math.random() * 1000);
//         const owner = faker.name.findName();
//         console.log(images);
//         await Item.create(name, price, color, onSale, sex,
//             star, situation, cleaning, afterService, manufacture,
//             category, brand, images, remain, reservation, owner);
//     }
//     return res.status(200).json({
//         message: '100 items are generated successfully'
//     });
// }
exports.createItems = async (req, res) => {
    const items = req.body;
    for (let item of items) {
        await Item.create(item);
    }
    return res.status(200).json({
        message: 'Item created successfully'
    });
};

exports.getItems = async (req, res) => {
    const {
        start,
        size
    } = req.params;
    const items = await Item.get(start, size);
    const length = items.length;
    let nextStart = parseInt(start) + length;
    if (length < size) {
        nextStart = -1;
    }
    return res.status(200).json({
        message: 'Items are returned successfully',
        numberOfItemsReturned: length,
        nextStart: nextStart,
        items
    });
};

exports.rentItemByItemId = async (req, res) => {
    const {
        item_id
    } = req.body;

    try {
        let item = await Item.findOneById(item_id);
        item.reservation += 1;
        await item.save();
        let user = await User.findOneByUsername(req.decoded.username);
        let object = {
            _id: item_id,
            rent_time: new Date()
        }
        if ((user.shopping.hanger - item.coin) > 0) {
            user.shopping.hanger -= item.coin;
            user.shopping.items.push(object);
            await user.save();
            return res.status(200).json({
                message: 'rent successfully'
            })
        } else {
            return res.status(200).json({
                message: 'not enough hangers'
            })
        }

    } catch (err) {
        res.status(406).json({
            err
        })
    }

}