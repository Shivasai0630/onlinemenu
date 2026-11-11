const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RestaurantInfo = sequelize.define('RestaurantInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: 'THE LAVISH RESTAURANT'
  },
  tagline: {
    type: DataTypes.STRING,
    defaultValue: 'Experience the Taste. Enjoy the Lavish Life.'
  },
  about: {
    type: DataTypes.TEXT,
    defaultValue: 'Welcome to The Lavish Restaurant, where culinary grandeur meets unforgettable hospitality. Indulge in our slow-cooked royal Dum Biryanis, succulent clay-oven Kebabs, and aromatic curries prepared with time-honored recipes and premium spices.'
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: '+91 98765 43210'
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    defaultValue: '919876543210'
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: 'contact@thelavishrestaurant.com'
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: 'Plot 42, Royal Grand Avenue, Near Luxury Circle, Jubilee Hills, Hyderabad, Telangana 500033'
  },
  openingHours: {
    type: DataTypes.STRING,
    defaultValue: 'Mon - Sun: 11:30 AM – 11:30 PM'
  },
  googleMapsUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://maps.google.com'
  },
  instagramUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://instagram.com/thelavishrestaurant'
  },
  facebookUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://facebook.com/thelavishrestaurant'
  },
  tableReservationEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = RestaurantInfo;
