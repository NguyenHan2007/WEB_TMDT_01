const setRole = (req, res) => {
    if (req.user.role === 1) {
        res.locals.isStudent = true;
        res.locals.isTeacher = false;
        res.locals.isAdmin = false;
    }
    else if (req.user.role === 2) {
        res.locals.Checking = true;
        res.locals.isStudent = true;
        res.locals.isTeacher = false;
        res.locals.isAdmin = false;
    }
    else if (req.user.role === 0) {
        res.locals.isStudent = false;
        res.locals.isTeacher = true;
        res.locals.isAdmin = false;
    }
    else if (req.user.role === 10) {
        res.locals.isStudent = false;
        res.locals.isTeacher = false;
        res.locals.isAdmin = true;
    }
}
module.exports = {
    settingRole:(req, res, next) => {
        if(req.user)
        {
            setRole(req, res);
        }
        return next();
    },
    isTeacher: (req, res, next) => {
        // setRole(req, res);
        if (res.locals.isTeacher) return next();
        else {
            res.render('../views/error', {layout:''})
        }
    },
    isUser: (req, res, next) => {
        // setRole(req, res);
        if (res.locals.isTeacher || res.locals.isStudent) return next();
        else {
            res.render('../views/error', {layout:''})
        }
    },
    isAdmin: (req, res, next) => {
        // setRole(req, res);
        if (res.locals.isAdmin) return next();
        else {
            res.render('../views/error', {layout:''})
        }
    }
}