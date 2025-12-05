import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../api/properties';
import { PropertyType } from '../types';
import { PlusCircle, MapPin, Home, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: PropertyType.APARTMENT,
    address: '',
    city: '',
    country: '',
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    pricePerNight: 5000, // в центах (50€)
    amenities: [] as string[],
    images: [] as string[],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProperty(formData);
      toast.success('Property created successfully!');
      navigate('/my-properties');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <PlusCircle className="w-10 h-10 text-primary" />
          Add New Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <Home className="w-6 h-6" />
                Basic Information
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Beautiful Apartment in Prague"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Describe your property..."
                  className="textarea textarea-bordered h-32"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Property Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                >
                  <option value={PropertyType.APARTMENT}>Apartment</option>
                  <option value={PropertyType.HOUSE}>House</option>
                  <option value={PropertyType.VILLA}>Villa</option>
                  <option value={PropertyType.ROOM}>Room</option>
                  <option value={PropertyType.STUDIO}>Studio</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <MapPin className="w-6 h-6" />
                Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Hlavní 123"
                    className="input input-bordered"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Prague"
                    className="input input-bordered"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Czech Republic"
                    className="input input-bordered"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Guests</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bedrooms</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Beds</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bathrooms</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <DollarSign className="w-6 h-6" />
                Pricing
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price per Night (€)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="50.00"
                  className="input input-bordered"
                  value={formData.pricePerNight / 100}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: Math.round(parseFloat(e.target.value) * 100) })}
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Current: €{(formData.pricePerNight / 100).toFixed(2)}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Amenities</h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="WiFi, Parking, Kitchen..."
                  className="input input-bordered flex-1"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button type="button" onClick={addAmenity} className="btn btn-primary">
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {formData.amenities.map((amenity, idx) => (
                  <div key={idx} className="badge badge-lg gap-2">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(idx)}
                      className="btn btn-ghost btn-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Images</h2>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered flex-1"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <button type="button" onClick={addImage} className="btn btn-primary">
                  Add
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img src={image} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="btn btn-error btn-xs absolute top-2 right-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};