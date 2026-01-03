const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  };

module.exports.renderNewForm =  (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing =  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author",},})
      .populate("owner"); 
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res, next) => {
     let url=req.file.path;
     let filename=req.file.filename;
      const newListing = new Listing(req.body.listing);
     newListing.image={url,filename};
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
    };

    module.exports.renderEditForm = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
          req.flash("error", "Listing you requested for does not exist!");
          return res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        console.log(originalImageUrl);
       originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs", { listing,originalImageUrl});
      };

      module.exports.upateListing = async (req, res) => {
          let { id } = req.params;
          let listing=  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        
          if(typeof req.file != "undefined"){
          let url=req.file.path;
         let filename=req.file.filename;
          listing.image={url,filename};
          await listing.save();
          }
         
         req.flash("success", "Listing Updated!");
          res.redirect(`/listings/${id}`);
        };

        module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
  };

  // search

module.exports.searchByCountryAndLocation = async (req, res) => {
  const { query } = req.query; // use one search box for both

  try {
    if (!query || query.trim() === "") {
      return res.redirect('/listings'); // fallback to show all
    }

    const searchRegex = new RegExp(query.trim(), 'i'); // case-insensitive

    const listings = await Listing.find({
      $or: [
        { country: { $regex: searchRegex } },
        { location: { $regex: searchRegex } }
      ]
    });

    res.render('listings/index.ejs', { listings, searchQuery: query });
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).send('Server Error');
  }
};


