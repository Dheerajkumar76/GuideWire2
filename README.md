# RoadWatch: Artificial Intelligence-based Accident Detection and Fraud-Resistant Logistics

RoadWatch is a gig economy road safety platform. It uses sensor fusion with computer vision to make real-time predictions of the accidents and a fraud-immune insurance trigger to defend liquidity pools against GPS-spoofing attacks.

## Project Story

### Inspiration  
Our everyday experience of the Bengaluru traffic jam and increasing rate of road accidents drove us to construct RoadWatch. GPS is there and does not ascertain what is going on the ground. We were reminded by a market crash that happened recently when the fraudsters took advantage of parametric insurance that we needed a system that would extend beyond the simple tracking of location and checking physical reality.

### What it does  
RoadWatch is an AI-based road accident analysis and prediction. With the help of YOLO, it finds hazards; machine-learning models predict high-risk areas. We have implemented an adversarial defense layer after the market crisis that combines sensor data to verify whether a delivery partner is indeed stuck or just hacking his GPS at home.

### How we built it  
Our front and back-ends were based on React and Node.js, respectively. The AI kernel executes Python based on YOLOv8 object detector and RNN based trajectory analyzers. In order to prevent spoofing, we exploited mobile hardware APIs to read IMU data and compare movement vibrations with the reported GPS positions.

### Challenges we ran into  
The most difficult was the pivot of the 24 hrs market crash. It was important to differentiate an actual network drop and a spoof in GPS. We developed a leveled trust rating; in case of discrepancies in the data, we will ask them to record a brief camera footage as a visual confirmation rather than rejecting them outright which will not compromise their security but will maintain fairness to the honest employees.

### Things we are proud of accomplishing
- Effectively combined a multi mode anti spoofing approach in severe time-constrained conditions.  
- Created a computer vision pipeline to authenticate environmental features such as rain, flooding as ground truth in claims of insurance.  
- Architected a competitive framework with graph-based cluster analysis in order to overcome organized syndicate attacks.

### What we learned  
GPS and other software data are prone to damages. This step demonstrated that genuine security of the gig economy needs sensor fusion, which is a set of hardware sensors and software coordinates, to construct airtight logic.

### What's next for RoadWatch  
- Edge ML: running YOLO models on mobile devices to detect accidents in real-time and offline.  
- Biometric confirmation: the introduction of face-matching on red-alert claims to ensure that the registered driver is present on the scene.

### Anti-spoofing Strategy and Adversarial Defense
This will deal with the vulnerability report of the GPS-spoofing syndicates which is critical and within 24 hours.

### The Differentiation: Behavioral vs. Synthetic Movement
RoadWatch is not only limited to GPS positions but it aims at physical evidence of presence. The difference between synthetic movement, which is smooth lines and unchanging speed, and the original movement, which represents bumps on the highway and road topography, is what our RNN model can differentiate between synthetic and authentic movement.

### Inertial Validation 
We contrast GPS data and the IMU (gyroscope and accelerator) of the device. The vibration patterns of a real worker in a storm will be vibration patterns; a spoofer at home will be a flat inertial profile.

### The Datum: Multi-Mode Testing
We consume more than fundamental co-ordinates:
- **Network triangulation**: the system verifies cell tower IDs and Wi-Fi SSIDs. When the GPS is claiming a zone that is in the storm and home Wi-Fi is indicated on the network, the claim is auto-flagged.  
- **Mesh proximity**: BLE heartbeats are used to identify whether users claiming to be in the same place can detect the devices of each other, exposing organized clusters of fraud.

### The UX Balance: Tiered Trust Scoring
In order to safeguard honest workers during actual network drops we adopt a level based system:
- **Green Tier**: high trust, auto-payout.  
- **Yellow Tier (soft flag)**: we demand a brief visual confirmation.  
- **CV verification**: Our YOLO engine inspects a 5-second video to ensure that rain, flood levels, and road debris are in accordance with real-time weather metadata to release funds.

## Technical Stack  
- **Frontend**: React.js/Tailwind CSS
- **Backend**: Node.js / Express  
- **AI/ML**: Python, PyTorch, YOLOv8, RNN/LSTM
- **Database**: MongoDB
