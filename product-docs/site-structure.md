# Vertical Church Website - Site Structure

This document maps all pages and links for the Vertical Church website.

## Planned Site Map

```mermaid
flowchart TB
    subgraph Internal["Internal Pages"]
        HOME["/ (Home)"]
        
        subgraph AboutSection["About Section"]
            ABOUT["/about"]
            BELIEFS["/about/beliefs"]
        end
        
        subgraph VisitorJourney["Visitor Journey"]
            VISIT["/visit"]
            INVOLVED["/get-involved"]
        end
        
        EVENTS["/events"]
        SUPPORT["/support"]
        TEACHINGS["/teachings"]
    end

    subgraph External["External Links"]
        GIVING["Church Center Giving<br/>verticalchurchnorth.churchcenter.com"]
        GATEWAY["Gateway Church<br/>gateway.tv"]
        VERTICAL_COLUMBUS["Vertical Church Columbus<br/>verticalchurch.life"]
        BIBLE_LOGOS["Bible References<br/>bible.logos.com"]
        ESV_BIBLE["ESV Bible<br/>esvbible.org"]
        SOCIAL["Social Media<br/>(Facebook, Instagram, YouTube, Spotify)"]
    end

    subgraph Navigation["Main Navigation"]
        NAV_HOME["Home"]
        NAV_ABOUT["About"]
        NAV_VISIT["Plan Your Visit"]
        NAV_INVOLVED["Get Involved"]
        NAV_EVENTS["Events"]
        NAV_SUPPORT["Support Us"]
    end

    %% Navigation Links
    NAV_HOME --> HOME
    NAV_ABOUT --> ABOUT
    NAV_VISIT --> VISIT
    NAV_INVOLVED --> INVOLVED
    NAV_EVENTS --> EVENTS
    NAV_SUPPORT --> SUPPORT

    %% Internal Page Links
    HOME -->|"Plan Your Visit CTA"| VISIT
    HOME -->|"Get Involved CTA"| INVOLVED
    HOME -->|"About Us button"| ABOUT
    ABOUT -->|"More About Our Theology"| BELIEFS

    %% Get Involved Sub-sections
    INVOLVED -->|"Give link"| SUPPORT

    %% External Partner Links
    ABOUT -->|"Dan Ghramm - Gateway Church"| GATEWAY
    ABOUT -->|"Luke Ahrens - Vertical Columbus"| VERTICAL_COLUMBUS

    %% Bible Reference Links (from Beliefs page)
    BELIEFS --> BIBLE_LOGOS
    BELIEFS --> ESV_BIBLE
    
    %% Giving
    SUPPORT --> GIVING
```

## User Journey Diagram

The two primary user journeys for visitors:

```mermaid
flowchart LR
    subgraph Journey1["Journey 1: Plan Your Visit"]
        direction TB
        V1["Land on Home"] --> V2["Click 'Plan Your Visit'"]
        V2 --> V3["Learn What to Expect"]
        V3 --> V4["View Service Times"]
        V4 --> V5["Submit Visit Form"]
    end
    
    subgraph Journey2["Journey 2: Get Involved"]
        direction TB
        I1["Land on Home"] --> I2["Click 'Get Involved'"]
        I2 --> I3["Explore Next Steps"]
        I3 --> I4a["Salvation Info"]
        I3 --> I4b["Baptism Sign-up"]
        I3 --> I4c["Join Small Group"]
        I3 --> I4d["Serve on Team"]
    end
```

## Page Inventory

### Internal Pages

| Page | URL | Description | Status |
|------|-----|-------------|--------|
| Home | `/` | Main landing page with welcome message, service times, ministry cards | Built |
| About | `/about` | Church principles, history, mission, leadership team, pillars | Built |
| Beliefs | `/about/beliefs` | Detailed doctrinal statements and theological positions | Planned |
| Plan Your Visit | `/visit` | Service times, what to expect, FAQ, visit form | Built |
| Get Involved | `/get-involved` | Next steps (salvation, baptism), ministries, small groups, serving | Planned |
| Events | `/events` | Upcoming church events, calendar, registration | Planned |
| Support Us | `/support` | Online giving information and donation options | Planned |
| Teachings | `/teachings` | Sermon archive, series, filterable library | Planned |

### Get Involved Page Sections

| Section | Content |
|---------|---------|
| **Next Steps** | Salvation information, baptism sign-up, spiritual growth resources |
| **Ministries** | Small Groups, Children's Ministry, Student Ministry, Women's/Men's Ministry |
| **Small Groups** | Group finder, descriptions, sign-up form |
| **Serve** | Guest Services, Worship Team, Kids Team, Tech Team, Creative Team |

### External Links

| Destination | URL | Context |
|-------------|-----|---------|
| Church Center Giving | `verticalchurchnorth.churchcenter.com/giving` | "Support Us" button in navigation |
| Gateway Church | `gateway.tv` | Partner church - Elder Dan Ghramm |
| Vertical Church Columbus | `verticalchurch.life` | Partner church - Elder Luke Ahrens |
| Bible Logos | `bible.logos.com` | Scripture reference links on Beliefs page |
| ESV Bible | `esvbible.org` | Scripture reference links on Beliefs page |

## Navigation Structure

```mermaid
flowchart LR
    subgraph Header["Header Navigation"]
        direction LR
        H1["Home"] --> H2["About"] --> H3["Plan Your Visit"] --> H4["Get Involved"] --> H5["Events"] --> H6["Support Us"]
    end
```

## Ministry Sections (Home Page)

The home page features four ministry cards that appear in the footer area of multiple pages:

```mermaid
flowchart LR
    subgraph Ministries["Ministry Cards"]
        M1["Small Groups"]
        M2["Worship Service"]
        M3["Children's Ministry"]
        M4["Student Ministry"]
    end
```

> **Note:** These ministry cards appear as visual elements but do not currently link to dedicated pages on the site.

## Complete Link Hierarchy

```mermaid
flowchart TD
    ROOT["vertical.family"]
    
    ROOT --> HOME["/ Home"]
    ROOT --> ABOUT["/about"]
    ROOT --> VISIT["/visit"]
    ROOT --> INVOLVED["/get-involved"]
    ROOT --> EVENTS["/events"]
    ROOT --> SUPPORT["/support"]
    ROOT --> TEACHINGS["/teachings"]
    
    ABOUT --> BELIEFS["/about/beliefs"]
    
    HOME -.->|CTA| VISIT
    HOME -.->|CTA| INVOLVED
    
    INVOLVED -.->|Link| SUPPORT
    SUPPORT -.->|External| GIVING["churchcenter.com/giving"]
    
    ABOUT -.->|External| GATEWAY["gateway.tv"]
    ABOUT -.->|External| VCOLUMBUS["verticalchurch.life"]
    
    BELIEFS -.->|External| BIBLE["bible.logos.com<br/>(multiple verses)"]
    BELIEFS -.->|External| ESV["esvbible.org<br/>(multiple verses)"]
    
    style GIVING fill:#f9f,stroke:#333
    style GATEWAY fill:#f9f,stroke:#333
    style VCOLUMBUS fill:#f9f,stroke:#333
    style BIBLE fill:#f9f,stroke:#333
    style ESV fill:#f9f,stroke:#333
```

## Summary

**Total Internal Pages:** 8
- Home (`/`)
- About (`/about`)
- Beliefs (`/about/beliefs`)
- Plan Your Visit (`/visit`)
- Get Involved (`/get-involved`)
- Events (`/events`)
- Support Us (`/support`)
- Teachings (`/teachings`)

**Primary User Journey Pages:** 2
- Plan Your Visit - For first-time visitors
- Get Involved - For deeper engagement (ministries, next steps, small groups)

**Total External Link Destinations:** 6
- Church Center Giving (donations)
- Gateway Church (partner church)
- Vertical Church Columbus (partner church)
- Bible Logos (scripture references)
- ESV Bible (scripture references)
- Social Media (Facebook, Instagram, YouTube, Spotify)

**Navigation Items:** 6 (Home, About, Plan Your Visit, Get Involved, Events, Support Us)

**Ministry Sections:** 6 (Small Groups, Worship Service, Children's Ministry, Student Ministry, Women's Ministry, Men's Ministry)
