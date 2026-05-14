import React, { useContext, useState } from "react";
import "./Profile.scss";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../auth.context";
import { logout, updateProfile } from "../services/auth.api";
import { IoSaveOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "sonner";
import userLogo from '../../../userLogo.png'
const Profile = () => {
  const navItems = [
    { label: "Basic Info", active: true },
    // { label: "Professional", active: false },
    // { label: "Your Batches", active: false },
    // { label: "My Projects", active: false },
  ];

  const [readOnly, setReadOnly] = useState(true);
  const context = useContext(AuthContext);
  const { user, setUser} = context;
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    bio: user?.bio,
    contact: user?.contact,
    dob: user?.dob?.split("T")[0],
    city: user?.city,
    state: user?.state,
    pincode: user?.pincode,
    profilePic: user?.profilePic,
  });

  const handleLogout = async () => {
    try {
      const data = await logout();
      setUser(null);
      toast.success("User Logged Out Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Some error Occurred while logging out");
    } finally {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFormData((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(selectedFile),
    }));
  };

  const handleSave = async () => {
    try {
      // setLoading(true)
      const data = await updateProfile({ ...formData, image: file });
      setUser((prev) => ({
        ...prev,
        ...data,
      }));
      setReadOnly((prev) => !prev);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Some error Occurred while updating the profile");
    }
  };

  return (
    <main className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-card">
          <div className="profile-card__header">
            <div className="image-upload">
              <img src={formData.profilePic || userLogo} alt="profileImage" className="" />
              <label aria-label="Change profile picture">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={readOnly}
                />
              </label>
            </div>
            <h2 className="profile-card__name">{user?.username}</h2>
            {/* <span className="profile-role">STUDENT</span> */}
          </div>

          <nav className="profile-nav">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`profile-nav-item ${item.active ? "active" : ""}`}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__value">{user?.status == "Paid"? "Pro" : "Basic"}</span>
              <span className="profile-stat__label">Subscription</span>
            </div>
            {/* <div className="profile-stat">
              <span className="profile-stat__value">1</span>
              <span className="profile-stat__label">Enrolled Batches</span>
            </div> */}
          </div>
        </div>
      </aside>

      <section className="profile-main">
        <div className="profile-main__header">
          <div>
            <p className="profile-overline">Personal Information</p>
            <h1 className="profile-main__title">
              Update your personal details and contact information
            </h1>
            <p className="profile-main__subtitle">
              Manage your account, contact information, and location details
              from one place.
            </p>
          </div>

          {readOnly ? (
            <div className="profile-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setReadOnly((prev) => !prev)}
              >
                <IoSaveOutline />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="profile-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setReadOnly((prev) => !prev)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleSave}
              >
                <FaRegEdit />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="profile-panel">
          <div className="profile-panel__section">
            <div className="section-title">
              <span className="section-indicator">👤</span>
              <div>
                <h2 className="section-heading">Personal Information</h2>
                <p className="section-copy">
                  Update your personal details and contact information.
                </p>
              </div>
            </div>

            <div className="profile-row">
              <div className="field-group">
                <label htmlFor="userName">User Name</label>
                <input
                  id="userName"
                  type="text"
                  value={user.username}
                  onChange={handleChange}
                  disabled
                />
              </div>
              {/* <div className="field-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={} readOnly />
              </div> */}
              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={user?.email}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="field-group">
                <label htmlFor="contact">Contact</label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  value={formData?.contact}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={readOnly}
                />
              </div>
              <div className="field-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData?.dob}
                  onChange={handleChange}
                  disabled={readOnly}
                />
              </div>
              <div className="field-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-panel">
          <div className="profile-panel__section">
            <div className="section-title">
              <span className="section-indicator">📍</span>
              <div>
                <h2 className="section-heading">Location & Professional</h2>
                <p className="section-copy">
                  Add location details and professional contact information.
                </p>
              </div>
            </div>

            <div className="profile-row">
              <div className="field-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  disabled={readOnly}
                  value={formData?.city}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  disabled={readOnly}
                  value={formData?.state}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData?.pincode}
                  disabled={readOnly}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter country"
                  disabled
                  value={"India"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
