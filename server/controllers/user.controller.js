
import User from '../models/user.model.js';

export const getData = async (req, res) => {   
    try {
        const user = req.user;
        const role = user.role;
        if(role === 'user'){
            const data = {
                name: user.name,
                email: user.email,
                password: user.password
            }
            return res.status(200).send({
                success: true,
                message: 'Successful!',
                dashboard: 'user',
                data
            })
        }

        if(role === 'admin'){
            let data = await User.find({});
            data = data.filter((userData ) => userData._id != user._id );
            data = data.map((userData) => {
                return ({
                    _id: userData._id,
                    name: userData.name,
                    role: userData.role
                })
            })

            return res.status(200).send({
                success: true,
                message: 'Successful!',
                dashboard: 'admin',
                data
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const updateUser = async (req, res) => {   
    try {
        const newData = req.body;
        const user = req.user;

        if(newData.name === user.name && newData.email === user.email && newData.password === user.password){
            return res.status(404).json({
                success: false,
                message: 'Nothing has changed!'
            })
        }

        let newName;
        let newEmail;
        let newPassword;

        if( newData.name !== user.name ){
            newName = newData.name;
        }else{
            newName = user.name;
        }

        if(newName.length === 0){
            return res.status(404).json({
                success: false,
                message: 'Name is not valid!'
            })
        }

        if( newData.email !== user.email ){
            newEmail = newData.email;
        }else{
            newEmail = user.email;
        }

        if(!newEmail.includes('@') || !newEmail.includes('.com')){
            return res.status(404).json({
                success: false,
                message: 'Email is not valid!'
            })
        }

        if(newEmail !== user.email){
            const existingEmail = await User.findOne({ email: newEmail });
            if(existingEmail){
                return res.status(404).json({
                    success: false,
                    message: 'Another user with this email is already present!'
                })
            }
        }

        if( newData.password !== user.password ){
            newPassword = newData.password;
        }else{
            newPassword = user.password;
        }

        if( newPassword !== user.password ){
            if(newPassword.includes(' ')){
                return res.status(404).json({
                    success: false,
                    message: 'User password should not contains empty space!!'
                })
            }
            if(newPassword.length < 6 ){
                return res.status(404).json({
                    success: false,
                    message: 'User password should be atleast 6 characters!!'
                })
            }
        }
        const updatedUser = await User.findOneAndUpdate({ _id: user._id}, { 
            name: newName,
            email: newEmail,
            password: newPassword
        })

        return res.status(200).send({
            success: true,
            message: 'Successfully updated!',
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}