const jwt = require('jsonwebtoken');
const Item = require('../../../models/item');
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
exports.items = async (req, res) => {
    const items = req.body;
    for (let item of items){
        await Item.create(item);
    }
    return res.status(200).json({
        message: 'Item created successfully'
    });
};