import mongoose from 'mongoose';

const animeSeriesSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    episodes: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret)=> {
            const baseUrl = `http://145.24.222.250:8001/animes`;
            ret._links = {
                self: {
                    href: `${baseUrl}/${ret.id}`
                },
                collection: {
                    href: baseUrl
                }
            };
            delete ret._id;
        }
    }
});

// Pre-save middleware to handle auto-incrementing IDs
animeSeriesSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastAnime = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
        this.id = lastAnime ? lastAnime.id + 1 : 1;
    }
    next();
});

const AnimeSeries = mongoose.model('AnimeSeries', animeSeriesSchema);

export default AnimeSeries;