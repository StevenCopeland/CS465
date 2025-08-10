const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

const tripsList = async (req, res) => {
  try {
    const q = await Trip.find({}).lean();
    return res.status(200).json(q); // [] if none
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching trips', error: err.message });
  }
};

const tripsFindByCode = async (req, res) => {
  try {
    const q = await Trip.findOne({ code: req.params.tripCode }).lean();
    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching trip', error: err.message });
  }
};

const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const q = await newTrip.save();
    return res.status(201).json(q);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid trip payload', error: err.message });
  }
};

const tripsUpdateTrip = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const q = await Trip
    .findOneAndUpdate(
      { 'code': req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      }
    )
    .exec();
  if (!q) { // Database returned no data
    return res
      .status(400)
      .json(err);
  } else { // Return resulting updated trip
    return res
      .status(201)
      .json(q);
  }
// Uncomment the following line to show results of operation
// on the console
// console.log(q);
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};