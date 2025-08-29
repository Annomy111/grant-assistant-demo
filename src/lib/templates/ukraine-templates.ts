import { GrantTemplate } from './template-types';

// ============================================================================
// CERV PROGRAMME TEMPLATES
// ============================================================================

export const CERV_CHILD_UKRAINE_TEMPLATE: GrantTemplate = {
  id: 'cerv-child-2025',
  programType: 'CERV',
  actionType: 'COOPERATION',
  name: 'CERV-2025-CHILD - Rights of the Child (Ukraine Focus)',
  description: 'Supporting Ukrainian children affected by war, including refugees and displaced children',
  language: 'en',
  metadata: {
    fundingRate: 90,
    typicalDuration: '24 months',
    typicalBudget: '€100,000-€1,000,000',
    consortiumRequirements: [
      'Minimum 2 applicants from 2 different eligible countries',
      'Lead applicant must be from EU member state',
      'Ukrainian organizations can be partners'
    ],
    deadlineInfo: '29 April 2025, 17:00 CET',
    ukraineSpecific: true,
    simplifiedAdmin: false
  },
  keywords: ['children', 'rights', 'Ukraine', 'refugees', 'protection', 'psychosocial support'],
  sections: [
    {
      id: 'relevance',
      title: 'Relevance',
      description: 'Alignment with call priorities and child rights objectives',
      weight: 30,
      totalWordLimit: 5000,
      evaluationCriteria: [
        'Compliance with call objectives and priorities',
        'Needs assessment quality',
        'EU added value',
        'Expected results'
      ],
      subsections: [
        {
          id: 'priorities',
          title: '1.1 Call Priorities Alignment',
          description: 'How project addresses CERV-2025-CHILD priorities',
          wordLimit: 2000,
          templateContent: `## 1.1 Alignment with Call Priorities

### Primary Priority Addressed
This project directly addresses the priority: "Protection and support for children affected by war, including Ukrainian refugees and displaced children"

### Specific Objectives
Our project will:
1. **Child Protection Systems**: Strengthen child protection mechanisms for Ukrainian refugee children in [HOST_COUNTRIES]
2. **Psychosocial Support**: Provide trauma-informed care to [NUMBER] Ukrainian children affected by war
3. **Education Continuity**: Ensure access to education and learning opportunities
4. **Family Support**: Strengthen family-based care and prevent separation
5. **Integration Support**: Facilitate integration while preserving cultural identity

### Target Groups
- Ukrainian refugee and displaced children (ages 0-18)
- Children remaining in Ukraine in conflict-affected areas
- Host community children to promote integration
- Parents, caregivers, and child protection professionals

### Geographic Coverage
- EU Member States: [LIST_COUNTRIES]
- Ukraine: [REGIONS] (where security permits)
- Online/remote support for wider reach`,
          fields: [
            {
              id: 'target_children_number',
              label: 'Number of children to be directly supported',
              type: 'number',
              required: true,
              helpText: 'Minimum 500 for meaningful impact'
            }
          ]
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality',
      description: 'Project design, implementation, and evaluation',
      weight: 40,
      evaluationCriteria: [
        'Clarity of methodology',
        'Feasibility of work plan',
        'Cost-effectiveness',
        'Monitoring and evaluation framework'
      ],
      totalWordLimit: 6000,
      subsections: [
        {
          id: 'activities',
          title: '2.1 Activities and Methodology',
          description: 'Detailed activity description and implementation approach',
          wordLimit: 3000,
          templateContent: `## 2.1 Project Activities

### Work Package 1: Needs Assessment and Mapping (Months 1-3)
- Activity 1.1: Comprehensive needs assessment of Ukrainian children
- Activity 1.2: Service mapping and gap analysis
- Activity 1.3: Stakeholder consultation workshops

### Work Package 2: Direct Support Services (Months 4-22)
- Activity 2.1: Child-friendly spaces establishment (minimum 10 centers)
- Activity 2.2: Psychosocial support programs (art therapy, play therapy)
- Activity 2.3: Educational support and language learning
- Activity 2.4: Legal assistance for documentation and rights

### Work Package 3: Capacity Building (Months 6-20)
- Activity 3.1: Training for child protection professionals
- Activity 3.2: Foster care and guardianship support
- Activity 3.3: School integration support programs

### Work Package 4: Dissemination (Months 18-24)
- Activity 4.1: Good practice documentation
- Activity 4.2: Policy recommendations development
- Activity 4.3: Final conference and toolkit launch`,
          fields: []
        }
      ]
    },
    {
      id: 'impact',
      title: 'Expected Results and Impact',
      description: 'Outputs, outcomes, and long-term impact',
      weight: 30,
      totalWordLimit: 4000,
      subsections: [
        {
          id: 'results',
          title: '3.1 Expected Results',
          description: 'Measurable outputs and outcomes',
          wordLimit: 2000,
          templateContent: `## 3.1 Expected Results

### Outputs (Deliverables)
- [NUMBER] child-friendly spaces operational
- [NUMBER] children receiving direct support
- [NUMBER] professionals trained
- [NUMBER] families supported
- 1 comprehensive toolkit produced
- 3 policy briefs published

### Outcomes (Changes)
- Improved psychosocial wellbeing for 80% of participating children
- School enrollment rate of 95% for supported children
- Reduced family separation incidents
- Enhanced child protection capacity in host communities

### Impact (Long-term)
- Sustainable child protection systems for refugee children
- Model for EU-wide response to child displacement
- Contribution to Ukraine's child protection framework post-conflict`,
          fields: []
        }
      ]
    }
  ]
};

// ============================================================================
// ERASMUS+ UKRAINE TEMPLATES
// ============================================================================

export const ERASMUS_CBHE_UKRAINE_TEMPLATE: GrantTemplate = {
  id: 'erasmus-cbhe-2025',
  programType: 'ERASMUS_PLUS',
  actionType: 'CAPACITY_BUILDING',
  name: 'Erasmus+ Capacity Building in Higher Education - Ukraine',
  description: 'Strengthening Ukrainian higher education institutions and systems',
  language: 'en',
  metadata: {
    fundingRate: 80,
    typicalDuration: '36 months',
    typicalBudget: '€700,000-€1,000,000',
    consortiumRequirements: [
      'Minimum 2 HEIs from 2 different Programme Countries',
      'Minimum 2 HEIs from Ukraine',
      'Coordinator must be from Programme Country'
    ],
    deadlineInfo: '6 February 2025, 17:00 CET',
    ukraineSpecific: true,
    emergencyProcedure: false
  },
  keywords: ['higher education', 'capacity building', 'Ukraine', 'digitalization', 'reform'],
  sections: [
    {
      id: 'relevance',
      title: 'Relevance of the Project',
      description: 'Alignment with program and regional priorities',
      weight: 30,
      totalWordLimit: 8000,
      evaluationCriteria: [
        'Link to EU and Partner Country policies',
        'Needs analysis',
        'Complementarity with other initiatives',
        'Innovation'
      ],
      subsections: [
        {
          id: 'priorities',
          title: '1.1 Regional Priorities for Ukraine',
          description: 'Addressing Eastern Partnership priorities',
          wordLimit: 3000,
          templateContent: `## 1.1 Addressing Regional Priorities

### Priority Areas for Ukraine (as per Programme Guide)
This project addresses the following regional priorities:

**1. Digital Transformation**
- Development of digital competences
- Online and blended learning methodologies
- Digital infrastructure enhancement
- Cybersecurity in education

**2. Resilience and Recovery**
- Adaptation to wartime conditions
- Psychological support systems
- Emergency education protocols
- Infrastructure rehabilitation

**3. European Integration**
- Bologna Process implementation
- ECTS and Diploma Supplement
- Quality assurance alignment
- Academic mobility frameworks

**4. Green Transition**
- Sustainable campus development
- Environmental curricula integration
- Research for sustainability
- Energy efficiency measures

### Specific Ukraine Context (2025)
- Addressing displacement of students and staff
- Rebuilding damaged infrastructure
- Maintaining education continuity
- Supporting internationalization despite challenges`,
          fields: []
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality of Project Design',
      description: 'Work plan, methodology, and management',
      weight: 30,
      totalWordLimit: 10000,
      subsections: [
        {
          id: 'workplan',
          title: '2.1 Work Plan and Activities',
          description: 'Detailed work packages and timeline',
          wordLimit: 4000,
          templateContent: `## 2.1 Work Plan Structure

### WP1: Project Management (M1-36)
Lead: [EU_COORDINATOR]
- Consortium coordination
- Financial management
- Risk monitoring
- Quality assurance

### WP2: Needs Analysis and Baseline (M1-6)
Lead: [UKRAINIAN_PARTNER]
- Comprehensive needs assessment
- Stakeholder consultations
- Baseline data collection
- Context analysis update

### WP3: Curriculum Development (M7-24)
Lead: [EU_ACADEMIC_PARTNER]
- New course modules design
- Digital content creation
- Pedagogical training
- Pilot implementation

### WP4: Infrastructure and Equipment (M6-18)
Lead: [UKRAINIAN_HEI]
- Equipment procurement
- Digital platform setup
- Laboratory modernization
- Safety protocols

### WP5: Capacity Building (M12-30)
Lead: [EU_PARTNER]
- Staff training programs
- Study visits (if possible)
- Online workshops
- Mentoring schemes

### WP6: Quality and Sustainability (M24-36)
Lead: [QUALITY_PARTNER]
- Quality monitoring
- External evaluation
- Sustainability planning
- Institutionalization

### WP7: Dissemination and Exploitation (M6-36)
Lead: [CONSORTIUM]
- Communication strategy
- Stakeholder events
- Policy dialogue
- Result exploitation`,
          fields: []
        }
      ]
    },
    {
      id: 'partnership',
      title: 'Quality of Partnership',
      description: 'Consortium composition and management',
      weight: 20,
      totalWordLimit: 5000,
      subsections: [
        {
          id: 'consortium',
          title: '3.1 Consortium Composition',
          description: 'Partner roles and expertise',
          wordLimit: 2500,
          templateContent: `## 3.1 Partnership Structure

### EU Partners
**P1 - [COORDINATOR_NAME]** (Coordinator)
- Role: Overall coordination, WP1 lead
- Expertise: [SPECIFIC_EXPERTISE]
- Previous Ukraine cooperation: [EXPERIENCE]

**P2 - [EU_PARTNER_2]**
- Role: Academic development, WP3 lead
- Expertise: Curriculum design, quality assurance
- Contribution: [SPECIFIC_CONTRIBUTION]

### Ukrainian Partners
**P3 - [UKRAINIAN_HEI_1]**
- Role: Local coordination, WP2 lead
- Current challenges: [WARTIME_ADAPTATIONS]
- Commitment: Full participation despite conditions

**P4 - [UKRAINIAN_HEI_2]**
- Role: Implementation partner
- Regional coverage: [REGION]
- Student body: [NUMBER] including IDPs

### Associated Partners
- Ministry of Education and Science of Ukraine
- Ukrainian Association of Student Self-Government
- [INTERNATIONAL_ORGANIZATION]`,
          fields: []
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact and Sustainability',
      description: 'Expected impact and continuation strategy',
      weight: 20,
      totalWordLimit: 5000,
      subsections: [
        {
          id: 'impact',
          title: '4.1 Expected Impact',
          description: 'Short and long-term impact',
          wordLimit: 2500,
          templateContent: `## 4.1 Project Impact

### Immediate Impact (During Project)
- [NUMBER] students benefiting from new programs
- [NUMBER] staff members trained
- [NUMBER] courses modernized
- Digital infrastructure for [NUMBER] users

### Medium-term Impact (1-3 years post-project)
- Sustained curriculum improvements
- Enhanced international cooperation
- Improved graduate employability
- Strengthened research capacity

### Long-term Impact (3+ years)
- Contribution to Ukraine's HE reconstruction
- Model for crisis-resilient education
- EU-Ukraine academic integration
- Regional knowledge hub development

### Sustainability Measures
- Institutional commitment letters
- Budget allocation for continuation
- Integration into strategic plans
- Revenue generation models
- Partnership agreements for future cooperation`,
          fields: []
        }
      ]
    }
  ]
};

// ============================================================================
// GERMAN BILATERAL COOPERATION TEMPLATES
// ============================================================================

export const DAAD_UKRAINE_NETWORK_TEMPLATE: GrantTemplate = {
  id: 'daad-network-2025',
  programType: 'BILATERAL_DE_UA',
  actionType: 'COOPERATION',
  name: 'DAAD German-Ukrainian University Network',
  description: 'Academic cooperation program for German and Ukrainian universities',
  language: 'en',
  metadata: {
    fundingRate: 100,
    typicalDuration: '48 months',
    typicalBudget: '€400,000-€800,000',
    consortiumRequirements: [
      'German university as lead applicant',
      'At least 2 Ukrainian partner universities',
      'Additional German or EU partners allowed'
    ],
    deadlineInfo: '17 February 2025',
    ukraineSpecific: true,
    emergencyProcedure: false
  },
  keywords: ['academic cooperation', 'research', 'teaching', 'digitalization', 'reconstruction'],
  sections: [
    {
      id: 'project_description',
      title: 'Project Description',
      description: 'Goals, activities, and expected outcomes',
      weight: 40,
      totalWordLimit: 10000,
      subsections: [
        {
          id: 'objectives',
          title: '1.1 Project Objectives',
          description: 'Main goals and specific objectives',
          wordLimit: 2000,
          templateContent: `## 1.1 Project Objectives

### Overall Goal
Strengthen academic cooperation between German and Ukrainian universities to support Ukraine's higher education recovery and European integration.

### Specific Objectives
1. **Teaching Cooperation**
   - Joint degree programs development
   - Digital teaching methodologies
   - Curriculum modernization
   - Quality assurance alignment

2. **Research Collaboration**
   - Joint research projects
   - PhD supervision schemes
   - Research infrastructure sharing
   - Publication partnerships

3. **Capacity Building**
   - Academic staff development
   - Administrative capacity strengthening
   - Internationalization support
   - Crisis management skills

4. **Student Support**
   - Mobility opportunities (virtual and physical)
   - Scholarship programs
   - Language training
   - Career development

### Expected Outcomes
- [NUMBER] joint courses developed
- [NUMBER] staff exchanges
- [NUMBER] student mobilities
- [NUMBER] joint publications
- Sustainable partnership framework`,
          fields: []
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Plan',
      description: 'Work packages, timeline, and deliverables',
      weight: 30,
      totalWordLimit: 8000,
      subsections: [
        {
          id: 'workplan',
          title: '2.1 Work Plan',
          description: 'Activities and timeline',
          wordLimit: 4000,
          templateContent: `## 2.1 Implementation Structure

### Year 1: Foundation
- Partnership agreement finalization
- Needs assessment and baseline study
- Digital infrastructure setup
- First staff exchanges (if possible)
- Curriculum mapping

### Year 2: Development
- Joint course development
- Pilot student exchanges
- Research project initiation
- Training program rollout
- Quality framework establishment

### Year 3: Consolidation
- Full program implementation
- Research outputs production
- Sustainability planning
- External evaluation
- Scale-up preparation

### Year 4: Sustainability
- Institutionalization of cooperation
- Additional funding acquisition
- Network expansion
- Impact assessment
- Model dissemination

### Key Deliverables
- Cooperation agreements
- Joint study programs
- Digital learning platform
- Research publications
- Sustainability roadmap`,
          fields: []
        }
      ]
    },
    {
      id: 'budget',
      title: 'Budget and Resources',
      description: 'Financial planning and resource allocation',
      weight: 30,
      totalWordLimit: 5000,
      subsections: [
        {
          id: 'budget_allocation',
          title: '3.1 Budget Structure',
          description: 'Funding distribution and justification',
          wordLimit: 2000,
          templateContent: `## 3.1 Budget Allocation

### Total Budget: €[AMOUNT]

### Cost Categories
1. **Personnel Costs (40%)**
   - Project coordination
   - Academic staff time
   - Administrative support
   - Student assistants

2. **Mobility Costs (25%)**
   - Staff exchanges
   - Student mobility
   - Virtual mobility support
   - Emergency evacuation provision

3. **Equipment and Infrastructure (20%)**
   - Digital equipment for Ukrainian partners
   - Software licenses
   - Laboratory equipment
   - Library resources

4. **Events and Training (10%)**
   - Workshops and seminars
   - Summer schools
   - Conferences
   - Training materials

5. **Other Costs (5%)**
   - Publication costs
   - External evaluation
   - Audit
   - Contingency

### Ukrainian Partner Support
- Direct funding: €[AMOUNT]
- Equipment provision: €[AMOUNT]
- Capacity building: €[AMOUNT]
- Emergency support fund: €[AMOUNT]`,
          fields: []
        }
      ]
    }
  ]
};

// ============================================================================
// UKRAINE FACILITY TEMPLATE
// ============================================================================

export const UKRAINE_FACILITY_CSO_TEMPLATE: GrantTemplate = {
  id: 'ukraine-facility-cso-2025',
  programType: 'RECONSTRUCTION',
  actionType: 'CAPACITY_BUILDING',
  name: 'Ukraine Facility - Civil Society Support',
  description: 'EU Ukraine Facility funding for civil society organizations supporting recovery and reforms',
  language: 'en',
  metadata: {
    fundingRate: 95,
    typicalDuration: '24-36 months',
    typicalBudget: '€200,000-€2,000,000',
    consortiumRequirements: [
      'Lead applicant must be civil society organization',
      'Ukrainian organizations encouraged as lead or partners',
      'Minimum 2 organizations recommended'
    ],
    deadlineInfo: 'Rolling calls throughout 2025',
    ukraineSpecific: true,
    emergencyProcedure: true,
    simplifiedAdmin: true
  },
  keywords: ['reconstruction', 'civil society', 'reforms', 'recovery', 'governance'],
  sections: [
    {
      id: 'alignment',
      title: 'Ukraine Plan Alignment',
      description: 'Contribution to Ukraine Plan objectives and reforms',
      weight: 35,
      totalWordLimit: 6000,
      evaluationCriteria: [
        'Clear link to Ukraine Plan priorities',
        'Reform agenda contribution',
        'Measurable impact on recovery',
        'Coordination with other initiatives'
      ],
      subsections: [
        {
          id: 'priorities',
          title: '1.1 Ukraine Plan Priorities',
          description: 'Alignment with facility objectives',
          wordLimit: 3000,
          templateContent: `## 1.1 Contribution to Ukraine Plan

### Primary Focus Area
This project contributes to: [SELECT: Macroeconomic Stability / Public Administration / Rule of Law / Anti-Corruption / Energy / Transport / Digital / Green Transition / Social Protection]

### Specific Reforms Supported
**Reform Area**: [SPECIFIC_REFORM]
**Ukraine Plan Chapter**: [CHAPTER_NUMBER]
**Expected Contribution**: [DESCRIPTION]

### Key Performance Indicators
Aligned with Ukraine Facility KPIs:
- Reform implementation support
- Institutional capacity building
- Public service delivery improvement
- Citizen engagement enhancement
- Transparency and accountability measures

### Cross-cutting Priorities
✓ Gender equality and women's empowerment
✓ Environmental sustainability
✓ Digitalization
✓ Social inclusion
✓ Youth participation

### Coordination Mechanism
- Alignment with government priorities
- Coordination with international partners
- Synergies with other EU programs
- Local ownership and participation`,
          fields: []
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Approach',
      description: 'Activities, methodology, and risk management',
      weight: 35,
      totalWordLimit: 8000,
      subsections: [
        {
          id: 'activities',
          title: '2.1 Key Activities',
          description: 'Main interventions and approaches',
          wordLimit: 4000,
          templateContent: `## 2.1 Implementation Strategy

### Component 1: Institutional Strengthening
- Capacity building for [NUMBER] CSOs
- Organizational development support
- Financial management training
- Digital transformation assistance

### Component 2: Service Delivery
- Direct support to [TARGET_GROUPS]
- Service points establishment
- Mobile teams deployment
- Online service platforms

### Component 3: Advocacy and Reform
- Policy dialogue facilitation
- Reform monitoring and feedback
- Citizen engagement mechanisms
- Transparency initiatives

### Component 4: Network Building
- CSO coalition strengthening
- Regional cooperation platforms
- Knowledge management system
- Peer learning exchanges

### Adaptive Management
- Quarterly review cycles
- Flexible budget reallocation (up to 20%)
- Crisis response protocols
- Remote implementation options`,
          fields: []
        }
      ]
    },
    {
      id: 'results',
      title: 'Expected Results',
      description: 'Outputs, outcomes, and impact measurement',
      weight: 30,
      totalWordLimit: 5000,
      subsections: [
        {
          id: 'results_framework',
          title: '3.1 Results Framework',
          description: 'Logical framework with indicators',
          wordLimit: 2500,
          templateContent: `## 3.1 Results and Indicators

### Output Indicators
- Number of CSOs strengthened: [TARGET]
- Citizens reached with services: [TARGET]
- Reform initiatives supported: [TARGET]
- Partnerships established: [TARGET]

### Outcome Indicators
- Improved CSO operational capacity: [%]
- Enhanced service accessibility: [%]
- Increased citizen satisfaction: [%]
- Reform implementation progress: [MEASURE]

### Impact Indicators
- Contribution to Ukraine's recovery
- Strengthened democratic governance
- Enhanced EU-Ukraine integration
- Improved social cohesion

### Monitoring Framework
- Baseline study (Month 1-3)
- Quarterly progress reports
- Mid-term evaluation (Month 12)
- Final evaluation (Month 24)
- Impact assessment (Month 36)

### Data Collection
- Beneficiary feedback systems
- Government statistics
- Third-party monitoring
- Digital monitoring tools`,
          fields: []
        }
      ]
    }
  ]
};

// ============================================================================
// MSCA4UKRAINE TEMPLATE
// ============================================================================

export const MSCA4UKRAINE_FELLOWSHIP_TEMPLATE: GrantTemplate = {
  id: 'msca4ukraine-2025',
  programType: 'MSCA4UKRAINE',
  actionType: 'FELLOWSHIP',
  name: 'MSCA4Ukraine Fellowship Support',
  description: 'Support for displaced Ukrainian researchers - Host organization application',
  language: 'en',
  metadata: {
    fundingRate: 100,
    typicalDuration: '12-24 months',
    typicalBudget: '€100,000-€200,000 per fellow',
    consortiumRequirements: [
      'Host organization in EU or Associated Country',
      'Named Ukrainian researcher(s)',
      'Can host multiple fellows'
    ],
    deadlineInfo: 'No new calls planned - check for updates',
    ukraineSpecific: true,
    emergencyProcedure: true,
    simplifiedAdmin: true
  },
  keywords: ['research', 'fellowship', 'displaced researchers', 'Ukraine', 'academic'],
  sections: [
    {
      id: 'excellence',
      title: 'Scientific Excellence',
      description: 'Research quality and researcher profile',
      weight: 50,
      totalWordLimit: 6000,
      subsections: [
        {
          id: 'research_project',
          title: '1.1 Research Project',
          description: 'Proposed research and innovation',
          wordLimit: 3000,
          templateContent: `## 1.1 Research Proposal

### Research Objectives
[Clear research objectives aligned with host institution strengths and researcher expertise]

### State of the Art
[Current knowledge and research gaps]

### Methodology
[Research methods and approaches]

### Innovation and Originality
[Novel aspects and potential breakthroughs]

### Researcher Profile
**Background**: [Academic and research experience]
**Displacement Context**: [Impact of war on research career]
**Expertise Match**: [Alignment with host institution]
**Career Stage**: [Doctoral candidate / Postdoctoral]

### Integration with Host Research
- Complementarity with ongoing projects
- Access to facilities and resources
- Collaboration opportunities
- Knowledge transfer potential`,
          fields: []
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact and Career Development',
      description: 'Career prospects and broader impact',
      weight: 30,
      totalWordLimit: 4000,
      subsections: [
        {
          id: 'career_development',
          title: '2.1 Career Development Plan',
          description: 'Support for researcher career',
          wordLimit: 2000,
          templateContent: `## 2.1 Career Development

### Training and Skills Development
- Research skills enhancement
- Complementary skills training
- Language support
- Grant writing training

### Integration Activities
- Departmental integration
- Networking opportunities
- Conference participation
- Publication support

### Career Prospects
- Short-term: Fellowship completion
- Medium-term: Continued collaboration
- Long-term: Contribution to Ukraine's research recovery

### Support Services
- Accommodation assistance
- Family support (if applicable)
- Psychological support
- Administrative assistance
- Legal support for documentation`,
          fields: []
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation',
      description: 'Host institution capacity and support',
      weight: 20,
      totalWordLimit: 3000,
      subsections: [
        {
          id: 'host_capacity',
          title: '3.1 Host Institution Capacity',
          description: 'Infrastructure and support systems',
          wordLimit: 1500,
          templateContent: `## 3.1 Hosting Arrangements

### Institutional Support
- Dedicated mentor/supervisor
- Research group integration
- Administrative support team
- IT and library access

### Research Environment
- Laboratory/office facilities
- Equipment and resources
- Research seminars
- Collaborative culture

### Practical Support
- Housing assistance
- Visa and permit support
- Health insurance arrangement
- Banking and administration
- Children's schooling (if applicable)

### Emergency Provisions
- Flexibility for family visits
- Remote work options if needed
- Crisis support mechanisms
- Connection to Ukrainian research community`,
          fields: []
        }
      ]
    }
  ]
};

// ============================================================================
// Export all templates
// ============================================================================

export const UKRAINE_SPECIFIC_TEMPLATES = [
  CERV_CHILD_UKRAINE_TEMPLATE,
  ERASMUS_CBHE_UKRAINE_TEMPLATE,
  DAAD_UKRAINE_NETWORK_TEMPLATE,
  UKRAINE_FACILITY_CSO_TEMPLATE,
  MSCA4UKRAINE_FELLOWSHIP_TEMPLATE
];

export function getUkraineTemplateById(id: string): GrantTemplate | undefined {
  return UKRAINE_SPECIFIC_TEMPLATES.find(t => t.id === id);
}

export function getUkraineTemplatesByProgram(programType: string): GrantTemplate[] {
  return UKRAINE_SPECIFIC_TEMPLATES.filter(t => t.programType === programType);
}

export function getUkraineTemplatesByLanguage(language: 'de' | 'en' | 'uk'): GrantTemplate[] {
  return UKRAINE_SPECIFIC_TEMPLATES.filter(t => t.language === language);
}