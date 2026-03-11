---
title: "저비용 조건부 자율주행 시뮬레이터 개발 및 평가"
subtitle: "Developing and Evaluating Low-Cost Level 3 Vehicle Simulator"
authors: "Jiwoo Hwang, Mingyu Han, Minji Kim, Auk Kim"
journal: "Proceedings of HCI Korea"
type: "Conference"
year: "2022"
date: "2022-01-01"
doi: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11043827"
paper: "/paper/HCIK22_simulater.pdf"
slide: ""
video: ""
abbrev: "HCIK"
---

# Developing and Evaluating Low-Cost Level 3 Vehicle Simulator

## Abstract

Conditional autonomous vehicles are becoming popular. As autonomous driving technology advances, drivers can spend more time on secondary tasks rather than driving, and accordingly, in-vehicle services for driver convenience will become more diverse. However, paradoxically, services for driver convenience can increase the accident risk of conditional autonomous vehicles. During autonomous driving, drivers must immediately transfer control (manual driving) when situations occur that the system cannot control, because attention distraction from secondary tasks slows response time. This makes it difficult to ensure driver safety. Therefore, research analyzing the negative effects of such services on drivers should be conducted first. To promote related research, this paper developed a simulator that can simulate autonomous vehicles at low cost, and conducted feasibility and usability tests to determine whether it can be used in actual research.

## Research Motivation

With the popularization of conditional autonomous vehicles, automobiles are changing from a space for transportation to a space that provides convenience. The number of autonomous vehicles is expected to reach approximately 60 million by 2028, and accordingly, it is expected that most vehicles in the near future will have conditional autonomous driving mode applied. Automobile companies such as Tesla have been applying low-level autonomous driving technology to automobiles since 2015, and with the popularization of such conditional autonomous vehicles, the burden of driving is decreasing.

The International Society of Automotive Engineers (SAE) classifies autonomous vehicles into a total of 6 levels from 'Level 0' to 'Level 5', which is the fully autonomous stage. Level 0 has no driving assistance functions. The current level of commercialized autonomous vehicles is Level 2. Up to Level 2, the system assists driving, but from Level 3, the system performs driving so that the vehicle can change lanes, overtake the car in front, or avoid obstacles on its own. However, up to Level 4, autonomous driving technology has limitations and performs conditional autonomous driving. That is, when unexpected situations occur, the system may not respond appropriately. At this time, drivers must receive driving control from the system (takeover) and perform manual driving.

## Research Objectives

This study aims to:
1. **Simulator Development**: Create a low-cost Level 3 autonomous vehicle simulator
2. **Feasibility Assessment**: Evaluate the simulator's suitability for research purposes
3. **Usability Testing**: Conduct tests to determine practical usability
4. **Cost-Effective Solution**: Provide an alternative to expensive commercial simulators

## Technical Implementation

### CARLA Platform Integration
- **Open Source Platform**: Utilized CARLA (Car Learning to Act) for simulation
- **Level 3 Environment**: Simulated SAE Level 3 conditional autonomous driving
- **Custom Development**: Built upon existing CARLA framework

### Simulator Features
- **Autonomous Driving Mode**: Simulates Level 3 autonomous driving conditions
- **Manual Takeover**: Enables control transfer from autonomous to manual mode
- **Secondary Task Support**: Allows drivers to engage in non-driving activities
- **Real-time Monitoring**: Tracks driver behavior and response times

## Research Methodology

### Development Process
1. **Platform Selection**: Chose CARLA as the base simulation platform
2. **Custom Implementation**: Developed Level 3 autonomous driving features
3. **Interface Design**: Created user-friendly control and monitoring interfaces
4. **Testing Framework**: Established evaluation protocols

### Evaluation Methods
- **Feasibility Testing**: Assessed technical capabilities and limitations
- **Usability Testing**: Evaluated user experience and interface design
- **Performance Analysis**: Measured system reliability and accuracy

## Key Findings

### Technical Performance
- **Simulation Quality**: Adequate for research purposes despite some limitations
- **Cost Effectiveness**: Significant cost reduction compared to commercial simulators
- **Functionality**: Successfully simulates Level 3 autonomous driving conditions

### User Experience
- **Handling Feedback**: Participants noted unnatural steering sensitivity
- **Pedestrian Behavior**: Unrealistic pedestrian crossing speeds were identified
- **Overall Usability**: Simulator deemed suitable for research applications

### Limitations Identified
- **Steering Sensitivity**: Mismatch between real vehicle and simulator steering response
- **Pedestrian Animation**: Unrealistic pedestrian movement patterns
- **Environmental Realism**: Some aspects of the driving environment need improvement

## Experimental Results

### Participant Demographics
- **Sample Size**: 10 participants
- **Age Range**: 20-25 years (mean: 22.3 years)
- **Response Time**: 0.763-2.199 seconds (mean: 1.453 seconds)

### Performance Metrics
- **Takeover Response Time**: Average 1.453 seconds
- **System Reliability**: Consistent performance across test sessions
- **User Acceptance**: Positive feedback for research applications

## Practical Implications

### Research Applications
- **Driver Behavior Studies**: Analyze driver responses during autonomous driving
- **Secondary Task Research**: Study non-driving activities during autonomous mode
- **Safety Assessment**: Evaluate the impact of in-vehicle services on safety

### Cost Benefits
- **Accessibility**: Enables research without expensive commercial simulators
- **Scalability**: Can be deployed across multiple research institutions
- **Customization**: Allows modification for specific research needs

## Future Improvements

### Technical Enhancements
- **Steering Sensitivity**: Adjust steering response to match real vehicles
- **Pedestrian Behavior**: Improve pedestrian movement realism
- **Environmental Details**: Enhance overall simulation fidelity

### Research Applications
- **Extended Testing**: Conduct longer-term studies with more participants
- **Scenario Development**: Create diverse driving scenarios for testing
- **Data Collection**: Implement comprehensive data logging capabilities

## Publication Details

- **Conference**: Proceedings of HCI Korea 2022
- **Pages**: 283-288
- **Year**: 2022
- **Location**: HCIK 2022

## Citation

Hwang, J., Han, M., Kim, M., & Kim, A. (2022). Developing and Evaluating Low-Cost Level 3 Vehicle Simulator. Proceedings of HCI Korea 2022, 283-288. 