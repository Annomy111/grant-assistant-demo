import { GrantTemplate } from './template-types';

export const CERV_UKRAINE_TEMPLATE: GrantTemplate = {
  id: 'cerv-ukraine-2025',
  programType: 'CERV',
  actionType: 'COOPERATION',
  name: 'CERV Programme - Ukraine Civil Society Support',
  description: 'Template for Citizens, Equality, Rights and Values programme with Ukraine association',
  language: 'en',
  metadata: {
    fundingRate: 90,
    typicalDuration: '24-36 months',
    typicalBudget: '€1-3 million',
    consortiumRequirements: [
      'Minimum 3 organizations from 3 different countries',
      'At least one Ukrainian civil society organization',
      'Lead applicant must be from EU member state'
    ],
    deadlineInfo: 'CERV-2025-CHILD: 29 April 2025 (Ukraine focus)',
    ukraineSpecific: true,
    simplifiedAdmin: true
  },
  keywords: ['civil society', 'democracy', 'rights', 'Ukraine', 'refugees', 'children'],
  sections: [
    {
      id: 'relevance',
      title: 'Relevance',
      description: 'Alignment with CERV objectives and Ukraine priorities',
      weight: 40,
      totalWordLimit: 8000,
      evaluationCriteria: [
        'Clear contribution to CERV objectives',
        'Address needs of Ukrainian civil society',
        'Support for Ukrainian refugees and displaced persons',
        'Promotion of EU values and democratic participation'
      ],
      subsections: [
        {
          id: 'objectives_cerv',
          title: '1.1 Project Objectives and CERV Alignment',
          description: 'How the project addresses CERV priorities with Ukraine focus',
          wordLimit: 2500,
          templateContent: `## 1.1 Project Objectives and CERV Alignment

### Primary Objective
[PROJECT_NAME] aims to strengthen civil society cooperation between the EU and Ukraine by [MAIN_OBJECTIVE], directly supporting Ukrainian organizations affected by the ongoing war while promoting European values of democracy, equality, and human rights.

### CERV Programme Alignment
Our project directly addresses CERV priorities:

**1. Equality, Rights and Gender Equality**
• Support for Ukrainian women and children affected by conflict
• Protection of vulnerable groups including refugees and IDPs
• Promotion of gender equality in reconstruction efforts

**2. Citizens' Engagement and Participation**
• Empowerment of Ukrainian civil society organizations
• Facilitation of EU-Ukraine civil society dialogue
• Youth participation in democratic processes

**3. Daphne - Combating Violence**
• Protection mechanisms for conflict-affected populations
• Support for GBV survivors
• Child protection in displacement contexts

**4. Union Values** (Note: Ukraine not eligible but benefits indirectly)
• Promoting rule of law and democratic values
• Supporting free media and civil liberties
• Countering disinformation

### Ukraine-Specific Objectives
Given Ukraine's association with CERV (since 09.01.2024), we specifically aim to:
• **Capacity Building**: Strengthen [NUMBER] Ukrainian CSOs through training and resources
• **Emergency Support**: Provide rapid response mechanisms for [TARGET_GROUP]
• **Integration**: Support integration of Ukrainian refugees in [EU_COUNTRIES]
• **Reconstruction**: Contribute to democratic reconstruction through [APPROACH]

### Expected Outcomes
1. **Immediate (Year 1)**:
   - Establishment of support network for [NUMBER] Ukrainian organizations
   - Direct assistance to [NUMBER] beneficiaries
   - Creation of emergency response protocols

2. **Medium-term (Year 2-3)**:
   - Sustainable partnerships between [NUMBER] EU and Ukrainian CSOs
   - Policy recommendations for EU-Ukraine civil society cooperation
   - Replication model for other regions`,
          fields: [
            {
              id: 'main_objective',
              label: 'Main Project Objective',
              type: 'textarea',
              required: true,
              helpText: 'Focus on civil society support and democratic values'
            },
            {
              id: 'target_groups',
              label: 'Primary Target Groups',
              type: 'array',
              required: true,
              helpText: 'Ukrainian CSOs, refugees, vulnerable populations'
            }
          ]
        },
        {
          id: 'needs_assessment',
          title: '1.2 Needs Assessment and Context',
          description: 'Current situation and identified needs',
          wordLimit: 2500,
          templateContent: `## 1.2 Needs Assessment and Context

### Current Context in Ukraine
Since February 2022, Ukrainian civil society faces unprecedented challenges:
• **Operational Disruption**: [PERCENTAGE]% of CSOs relocated or operating remotely
• **Resource Constraints**: Limited access to funding and technical resources
• **Security Concerns**: Ongoing safety risks for staff and beneficiaries
• **Increased Demand**: Exponential growth in humanitarian and social needs

### Identified Needs
Based on consultations with [NUMBER] Ukrainian organizations:

**1. Organizational Capacity**
• Emergency operational support for CSOs under war conditions
• Digital transformation for remote service delivery
• Financial sustainability mechanisms
• Staff wellbeing and psychological support

**2. Service Delivery**
• Humanitarian assistance coordination
• Legal aid for displaced persons
• Psychosocial support services
• Education continuity programs

**3. Advocacy and Voice**
• Platform for Ukrainian civil society in EU forums
• Documentation of human rights violations
• Counter-disinformation initiatives
• Youth civic engagement programs

### Target Beneficiaries
**Direct Beneficiaries**:
• [NUMBER] Ukrainian CSOs receiving capacity support
• [NUMBER] CSO staff trained
• [NUMBER] refugees/IDPs receiving services

**Indirect Beneficiaries**:
• [NUMBER] community members served by strengthened CSOs
• [NUMBER] youth engaged in civic activities
• Policy makers and international community

### Geographic Coverage
• **In Ukraine**: [REGIONS] (considering security situation)
• **In EU**: [COUNTRIES] with significant Ukrainian refugee populations
• **Virtual**: Online platforms for broader reach

### Evidence Base
Our needs assessment draws on:
• Survey of [NUMBER] Ukrainian CSOs (conducted [DATE])
• UNHCR and OCHA situation reports
• Consultations with [PARTNER_ORGANIZATIONS]
• Academic research on civil society in conflict contexts`,
          fields: [
            {
              id: 'needs_evidence',
              label: 'Evidence Sources',
              type: 'array',
              required: true,
              helpText: 'Data sources, reports, consultations'
            }
          ]
        },
        {
          id: 'european_dimension',
          title: '1.3 European Added Value',
          description: 'Trans-European cooperation and EU value',
          wordLimit: 1500,
          templateContent: `## 1.3 European Added Value

### Trans-European Cooperation
[PROJECT_NAME] creates a genuine European response to support Ukrainian civil society:

**Multi-Country Partnership**:
• Lead Partner: [ORGANIZATION] (Germany) - coordination and technical expertise
• Partner 2: [ORGANIZATION] (Poland) - proximity support and logistics
• Partner 3: [ORGANIZATION] (Romania) - refugee integration experience
• Partner 4: [ORGANIZATION] (Ukraine) - local context and networks

### EU Added Value
**1. Scale and Reach**
• Mobilizes resources beyond individual member state capacity
• Creates EU-wide support network for Ukrainian civil society
• Facilitates knowledge transfer across borders

**2. Policy Coherence**
• Aligns with EU's Eastern Partnership priorities
• Supports EU-Ukraine Association Agreement implementation
• Contributes to EU's humanitarian and development objectives

**3. Solidarity and Values**
• Demonstrates European solidarity with Ukraine
• Promotes EU fundamental values in practice
• Strengthens EU-Ukraine civil society ties

### Complementarity with Existing Initiatives
• Builds on MSCA4Ukraine researcher support model
• Complements Horizon Europe research cooperation
• Synergies with Erasmus+ youth exchanges
• Coordination with EU Delegation in Ukraine

### Long-term European Benefit
• Strengthened civil society across Europe
• Enhanced EU-Ukraine integration post-war
• Model for civil society support in crisis contexts
• Contribution to European security and stability`,
          fields: []
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality of Project Design',
      description: 'Methodology, activities, and implementation',
      weight: 30,
      totalWordLimit: 7000,
      evaluationCriteria: [
        'Clear and feasible work plan',
        'Appropriate methodology',
        'Risk assessment and mitigation',
        'Sustainability measures'
      ],
      subsections: [
        {
          id: 'methodology',
          title: '2.1 Methodology and Approach',
          description: 'Implementation methodology adapted for conflict context',
          wordLimit: 2500,
          templateContent: `## 2.1 Methodology and Approach

### Overall Methodology
Our approach combines emergency response with long-term capacity building:

**Three-Pillar Strategy**:
1. **Immediate Support** (Months 1-6)
   - Rapid grants for operational continuity
   - Emergency coordination mechanisms
   - Crisis communication systems

2. **Capacity Building** (Months 6-24)
   - Organizational development programs
   - Skills training and knowledge transfer
   - Peer-to-peer learning networks

3. **Sustainability** (Months 18-36)
   - Resource mobilization strategies
   - Partnership development
   - Policy advocacy

### Implementation Approach

**Flexible and Adaptive Management**:
• Quarterly adaptation cycles responding to changing context
• Remote and hybrid delivery modalities
• Security-conscious programming

**Participatory Methods**:
• Co-design with Ukrainian partners
• Regular beneficiary feedback loops
• Community-based monitoring

**Gender-Responsive Programming**:
• Gender analysis of all activities
• Women's leadership promotion
• GBV risk mitigation measures

### Key Activities

**Work Package 1: Emergency Support**
• Activity 1.1: Rapid response fund establishment
• Activity 1.2: Emergency grants distribution
• Activity 1.3: Crisis coordination platform

**Work Package 2: Capacity Development**
• Activity 2.1: Training program delivery
• Activity 2.2: Mentorship and coaching
• Activity 2.3: Resource center creation

**Work Package 3: Network Building**
• Activity 3.1: EU-Ukraine CSO exchanges
• Activity 3.2: Joint advocacy initiatives
• Activity 3.3: Knowledge sharing platform

### Innovation Elements
• Digital-first approach for accessibility
• Trauma-informed programming
• Flexible funding mechanisms
• Real-time monitoring systems`,
          fields: [
            {
              id: 'delivery_modality',
              label: 'Primary Delivery Method',
              type: 'select',
              options: ['Hybrid', 'Remote', 'In-person where safe'],
              required: true
            }
          ]
        },
        {
          id: 'risk_management',
          title: '2.2 Risk Assessment and Mitigation',
          description: 'Conflict-sensitive risk management',
          wordLimit: 1500,
          templateContent: `## 2.2 Risk Assessment and Mitigation

### Risk Matrix

| Risk Category | Specific Risk | Likelihood | Impact | Mitigation Measures |
|--------------|---------------|------------|---------|-------------------|
| **Security** | Escalation of conflict | High | High | • Remote implementation options<br>• Flexible geographic coverage<br>• Staff safety protocols<br>• Insurance coverage |
| **Operational** | Partner organization displacement | Medium | High | • Multiple implementation sites<br>• Cloud-based systems<br>• Backup coordination structures |
| **Financial** | Currency fluctuation (UAH) | High | Medium | • Euro-based budgeting<br>• Regular rate reviews<br>• Contingency reserves |
| **Political** | Change in regulations | Low | Medium | • Regular legal monitoring<br>• Adaptive programming<br>• Government liaison |
| **Technical** | Internet/power disruptions | High | Medium | • Offline capability<br>• Generator support<br>• Starlink connectivity |
| **Human Resources** | Staff burnout/trauma | Medium | High | • Psychological support<br>• Rotation policies<br>• Wellbeing programs |

### Conflict Sensitivity
• Do No Harm analysis conducted quarterly
• Local conflict dynamics monitoring
• Neutral and impartial positioning
• Inclusive stakeholder engagement

### Safeguarding
• Child protection policies
• PSEA measures
• Data protection (GDPR compliant)
• Complaint and feedback mechanisms

### Contingency Planning
• Scenario planning for three contexts:
  1. Status quo continuation
  2. Escalation scenario
  3. De-escalation/reconstruction
• Budget flexibility (20% reallocation allowed)
• Alternative implementation modalities`,
          fields: []
        },
        {
          id: 'sustainability',
          title: '2.3 Sustainability and Exit Strategy',
          description: 'Ensuring lasting impact beyond project period',
          wordLimit: 1500,
          templateContent: `## 2.3 Sustainability Strategy

### Sustainability Dimensions

**Financial Sustainability**:
• Diversified funding strategy development for partners
• Introduction to EU funding opportunities
• Local fundraising capacity building
• Social enterprise models exploration

**Institutional Sustainability**:
• Organizational policies and systems strengthening
• Leadership development programs
• Succession planning support
• Network formalization

**Technical Sustainability**:
• Local trainer certification
• Open-source resources creation
• Documentation and knowledge management
• Technology transfer

### Exit Strategy

**Phase 1: Preparation (Months 24-30)**
• Gradual handover of activities
• Partner capacity assessment
• Resource mobilization intensification

**Phase 2: Transition (Months 30-36)**
• Local ownership transfer
• Reduced direct support
• Focus on advisory role

**Phase 3: Post-Project (After Month 36)**
• Light-touch support
• Network maintenance
• Impact monitoring

### Legacy Elements
• Established EU-Ukraine CSO network
• Trained cadre of local experts
• Policy frameworks and guidelines
• Documented best practices
• Strengthened organizations continuing work`,
          fields: []
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact',
      description: 'Expected results and dissemination',
      weight: 30,
      totalWordLimit: 5000,
      evaluationCriteria: [
        'Clear impact pathways',
        'Measurable indicators',
        'Dissemination strategy',
        'Multiplier effects'
      ],
      subsections: [
        {
          id: 'expected_impact',
          title: '3.1 Expected Impact and Results',
          description: 'Short and long-term impact',
          wordLimit: 2000,
          templateContent: `## 3.1 Expected Impact

### Impact Pathway
**Inputs** → **Activities** → **Outputs** → **Outcomes** → **Impact**

### Expected Results

**Output Level**:
• O1: [NUMBER] Ukrainian CSOs receive emergency support
• O2: [NUMBER] staff members trained
• O3: [NUMBER] partnerships established
• O4: [NUMBER] beneficiaries served

**Outcome Level**:
• OC1: Increased operational capacity of Ukrainian CSOs
• OC2: Enhanced EU-Ukraine civil society cooperation
• OC3: Improved services for conflict-affected populations
• OC4: Strengthened democratic participation

**Impact Level**:
• Long-term resilience of Ukrainian civil society
• Contribution to democratic reconstruction
• Enhanced European integration
• Model for civil society support in crises

### Key Performance Indicators

| Indicator | Baseline | Target | Means of Verification |
|-----------|----------|---------|----------------------|
| CSOs operational capacity | 40% | 75% | Capacity assessment tool |
| Beneficiaries reached | 0 | 50,000 | Service records |
| Cross-border partnerships | 5 | 25 | Partnership agreements |
| Policy uptake | 0 | 3 | Policy documents |

### Gender and Inclusion Impact
• 60% women beneficiaries
• 30% youth participation
• Disability inclusion measures
• Minority representation`,
          fields: [
            {
              id: 'primary_impact_area',
              label: 'Primary Impact Focus',
              type: 'select',
              options: ['Organizational capacity', 'Service delivery', 'Policy influence', 'Network building'],
              required: true
            }
          ]
        },
        {
          id: 'dissemination',
          title: '3.2 Dissemination and Communication',
          description: 'Sharing results and knowledge',
          wordLimit: 1500,
          templateContent: `## 3.2 Dissemination Strategy

### Target Audiences
1. **Ukrainian Civil Society**: Direct beneficiaries and wider CSO community
2. **EU Institutions**: European Commission, Parliament, EEAS
3. **National Authorities**: Relevant ministries in participating countries
4. **International Community**: UN agencies, donors, INGOs
5. **Academic/Research**: Think tanks, universities
6. **General Public**: Citizens in EU and Ukraine

### Dissemination Channels

**Digital Platforms**:
• Project website (multilingual: EN/DE/UK)
• Social media campaign (#StandWithUkrainianCivilSociety)
• Webinar series (monthly)
• Online resource hub

**Publications**:
• Policy briefs (quarterly)
• Best practice guide
• Impact report
• Academic articles

**Events**:
• Launch conference (Brussels)
• Regional workshops (4)
• Final conference (Kyiv/hybrid)
• Side events at EU forums

**Media Engagement**:
• Press releases at milestones
• Op-eds in major outlets
• Journalist briefings
• Documentary participation

### Communication Materials
• Visual identity and branding
• Infographics and data visualizations
• Video testimonials
• Photo exhibitions

### Languages
All major outputs in: English, German, Ukrainian
Key materials also in: Polish, Romanian`,
          fields: []
        }
      ]
    }
  ]
};

export const CERV_DEMOCRACY_TEMPLATE: GrantTemplate = {
  id: 'cerv-democracy-2025',
  programType: 'CERV',
  actionType: 'COOPERATION',
  name: 'CERV Democracy and Civic Participation',
  description: 'Template for democracy, civic engagement and participation strand',
  language: 'en',
  metadata: {
    fundingRate: 90,
    typicalDuration: '12-24 months',
    typicalBudget: '€75,000-200,000',
    consortiumRequirements: ['Can be single applicant or consortium'],
    deadlineInfo: 'Various calls throughout 2025'
  },
  keywords: ['democracy', 'participation', 'civic engagement', 'citizens'],
  sections: [] // Simplified version
};