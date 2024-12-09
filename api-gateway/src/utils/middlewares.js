const { redisClient, isRedisConnected } = require('./redis');

exports.checkAuthentication = async (req, res, next) => {
    try {
      if (!isRedisConnected()) {
        return res.status(503).json({ msg: 'Redis service unavailable' });
      }
 console.log(req.cookies,"cokieeee");
  
      const sessionCookie = req.cookies['connect.sid'] || req.headers['authorization']; // Use session ID or JWT
      if (!sessionCookie) {
        return res.status(401).json({ msg: 'Unauthorized: No session ID provided' });
      }
      const sessionId = sessionCookie.split('.')[0].replace('s:', '');

    console.log('Extracted Session ID:', sessionId);
    const sessionKey = `sess:${sessionId}`;
      
      const sessionData = await redisClient.get(sessionKey);

      //console.log(sessionData);
  
      if (!sessionData) {
        return res.status(401).json({ msg: 'Unauthorized: Session expired or invalid' });
      }
  
      const session = JSON.parse(sessionData);
      if (!session.passport || !session.passport.user) {
        return res.status(401).json({ msg: 'Unauthorized: User not authenticated' });
      }
  
      req.user =session.passport.user
      req.headers['x-user'] = JSON.stringify(session.passport.user);
      console.log(req.user);
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };


  exports.checkAdminAuthentication = async (req, res, next) => {
    try {
      if (!isRedisConnected()) {
        return res.status(503).json({ msg: 'Redis service unavailable' });
      }
  
      const sessionCookie = req.cookies['connect.sid'] || req.headers['authorization']; // Use session ID or JWT
      if (!sessionCookie) {
        return res.status(401).json({ msg: 'Unauthorized: No session ID provided' });
      }
      const sessionId = sessionCookie.split('.')[0].replace('s:', '');

    console.log('Extracted Session ID:', sessionId);
    const sessionKey = `sess:${sessionId}`;
      
      const sessionData = await redisClient.get(sessionKey);

      //console.log(sessionData);
  
      if (!sessionData) {
        return res.status(401).json({ msg: 'Unauthorized: Session expired or invalid' });
      }
  
      const session = JSON.parse(sessionData);
      if (!session.passport || !session.passport.user) {
        return res.status(401).json({ msg: 'Unauthorized: User not authenticated' });
      }
   //   console.log(session.passport.user.role,'admin');
      
      if ((session.passport.user.role) != 'admin') {
        return res.status(403).json({ msg: 'Forbidden: Admin access required' });
      }
  
      req.user = session.passport.user;
      req.headers['x-user'] = JSON.stringify(session.passport.user);
      console.log(req.user);
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };