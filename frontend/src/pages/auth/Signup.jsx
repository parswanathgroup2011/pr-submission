import React ,{useState}from "react";
import {Link,useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../../utils";
import './Signup.css';
import axios from 'axios'; 

function Signup() {
  const [signupInfo,setSignupInfo] = useState({
    clientName:"",
    clientType:"",
    companyName:"",
    email:"",
    mobileNumber:"",
    address:"",
    state:"",
    city:"",
    pincode:"",
    website:"",
    password:"",
    confirmPassword:"",
    profileImage:null,
    businessLogo:null,
    gstNumber:"",
    gstImage:null,
    panNumber:"",
    panImage:null,
    ifscCode:"",
    bankName:"",
    branchName:"",
    micrCode:"",
    branchCode:"",
    authorisedName:"",
    accountNumber:""

 })



  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Changing:", name, "to", value); // Debugging log
    
  
    setSignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

//for images eg.profile image and business logo

  const handleFileChange =(e,fieldName) => {
    const file =e.target.files[0];
    console.log("select:",file)
    setSignupInfo((prev) => ({
      ...prev,
    [fieldName]:file
    }) )
};

  // Make sure axios is imported

const handleSignup = async (e) => {
  e.preventDefault();
  console.log("Signup button clicked");

  const { clientName, email, password, confirmPassword } = signupInfo;

  if (!clientName || !email || !password || !confirmPassword) {
    return handleError('Name, email and password are required');
  }

  if (password !== confirmPassword) {
    return handleError("Passwords do not match");
  }

  const url = "http://localhost:5002/api/auth/signup";

  try {
    const formData = new FormData();
    Object.keys(signupInfo).forEach((key) => {
      const value = signupInfo[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.post(url, formData);

    const { success, message, error } = response.data;

    if (success) {
      handleSuccess(message);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else if (error) {
      const details = error?.details?.[0]?.message;
      handleError(details || error);
    } else {
      handleError(message);
    }

    console.log(response.data);

  } catch (err) {
    handleError("Something went wrong");
    console.log(err);
  }
};

  return (
    <div className="signup-container">
      <h2 className="registration-name">Registration Form</h2>
      <form className="signup-form" onSubmit={handleSignup}>
     
    <fieldset className="section">
      <legend>General Information</legend>

      <div className="namefield">
      <div className="form-group"> 
        <label htmlFor="clientType">Client Type</label>
          
        <select
        onChange={handleChange}
        name="clientType"
        autoFocus
        value={signupInfo.clientType}
        >
        <option value="">Select Client Type</option>
        <option value="B2B">B2B</option>
        <option value="B2C">B2C</option>
        </select>
        </div>

        
        <div className="form-group">
          <label htmlFor="name">Client Name</label>
          <input
           onChange={handleChange}
            type="text"
            name="clientName"
            
            placeholder="Client Name"
            required
            value={signupInfo.clientName}
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
           onChange={handleChange}
            type="text"
            name="companyName"
            
            placeholder="Company Name"
            required
            value={signupInfo.companyName}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            required
            value={signupInfo.email}
          />
        </div>


        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input onChange={handleChange}
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            pattern="[0-9]{10}"
            maxLength={10}
            inputMode="numeric"
            required
            value={signupInfo.mobileNumber}
          />
        </div>

          
        

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input onChange={handleChange}
            type="text"
            name="address"
            placeholder="Address"
            required
            value={signupInfo.address}
          />
        </div>


        <div className="form-group">
          <label htmlFor="state">State</label>
          <input onChange={handleChange}
            type="text"
            name="state"
            placeholder="State"
            value={signupInfo.state}
          />
        </div>



        <div className="form-group">

          <label htmlFor="city">City</label>
          <input onChange={handleChange}
            type="text"
            name="city"
            placeholder="City"
            value={signupInfo.city}
          />
        </div>



        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input onChange={handleChange}
            type="text"
            name="pincode"
            placeholder="Pincode"
            pattern="\d{6}"
            maxLength={6}
            required
            value={signupInfo.pincode}
          />
        </div>



        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input onChange={handleChange}
            type="url"
            name="website"
            placeholder="Website"
            value={signupInfo.website}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input 
          onChange={(e) => handleFileChange(e,"profileImage")}
          type="file"
          name="profileImage" 
          accept="image/png, image/jpeg, image/jpg" 
          />
        </div>


        <div className="form-group">
          <label htmlFor="businessLogo">Business Logo</label>
          <input 
          onChange={(e) => handleFileChange(e,"businessLogo")}
          type="file"
          name="businessLogo" 
          accept="image/png, image/jpeg, image/jpg" 
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={signupInfo.password}
            required
          />
        </div>

        <div className="form-group">
        
          <label htmlFor="confirmPassword">Confirm password</label>
          <input onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={signupInfo.confirmPassword}
            required
          />
        </div></div>
        </fieldset>


        <fieldset className="section">
          <legend>Proof Details</legend>
          <div className="namefield">
          <div className="form-group">
            <label>GST Number</label>
            <input onChange={handleChange}
            type="text"
            name="gstNumber"
            placeholder="GST Number"
            value={signupInfo.gstNumber}
            />
          </div>

          <div className="form-group">
          <label>GST Image</label>
          <input 
          onChange={(e) => handleFileChange(e,"gstImage")}
          type="file"
          name="gstImage" 
          accept="image/png, image/jpeg, image/jpg" 
          />
        </div>

         <div className="form-group">
            <label>PAN Number</label>
            <input onChange={handleChange}
            type="text"
            name="panNumber"
            placeholder="PAN Number"
            value={signupInfo.panNumber}
            />
          </div>



          <div className="form-group">
          <label>PAN Image</label>
          <input 
          onChange={(e) => handleFileChange(e,"panImage")}
          type="file"
          name="panImage" 
          accept="image/png, image/jpeg, image/jpg" 
          />
        </div></div>

        </fieldset>

        <fieldset className="section">
          <legend>Bank Details</legend>
          <div className="namefield">
          <div className="form-group">
            <label>IFSC Code</label>
            <input onChange={handleChange}
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            value={signupInfo.ifscCode} 
            />
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input onChange={handleChange}
            type="text"
            name="bankName"
            placeholder="Bank Name"
            value={signupInfo.bankName} 
            />
          </div>

          <div className="form-group">
            <label>Branch Name</label>
            <input onChange={handleChange}
            type="text"
            name="branchName"
            placeholder="Branch Name"
            value={signupInfo.branchName} 
            />
          </div>


          <div className="form-group">
            <label>MICR Code</label>
            <input onChange={handleChange}
            type="text"
            name="micrCode"
            placeholder="MICR Code"
            value={signupInfo.micrCode} 
            />
          </div>


          <div className="form-group">
            <label>Branch Code</label>
            <input onChange={handleChange}
            type="text"
            name="branchCode"
            placeholder="Branch Code"
            value={signupInfo.branchCode} 
            />
          </div>


          <div className="form-group">
            <label>Authorised Name</label>
            <input onChange={handleChange}
            type="text"
            name="authorisedName"
            placeholder="Authorised Name"
            value={signupInfo.authorisedName} 
            />
          </div>


          <div className="form-group">
            <label>State Name</label>
            <input onChange={handleChange}
            type="text"
            name="state"
            placeholder="State Name"
            value={signupInfo.state} 
            />
          </div>

          <div className="form-group">
            <label>City Name</label>
            <input onChange={handleChange}
            type="text"
            name="city"
            placeholder="City Name"
            value={signupInfo.city} 
            />
          </div>




          <div className="form-group">
            <label>Account Number</label>
            <input onChange={handleChange}
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            value={signupInfo.accountNumber} 
            />
          </div></div>


        </fieldset>

        <div className="signup-button">
        <button type="submit">Signup</button>
        <span className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </span></div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
