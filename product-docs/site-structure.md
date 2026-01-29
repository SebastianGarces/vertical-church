# Vertical Church Website - Site Structure

This document maps all pages and links found on the live site at [vertical.family](https://www.vertical.family/).

## Site Map Diagram

```mermaid
flowchart TB
    subgraph Internal["Internal Pages (vertical.family)"]
        HOME["/ (Home)"]
        ABOUT["/about"]
        BELIEFS["/about/beliefs"]
        CONTACT["/contact"]
    end

    subgraph External["External Links"]
        GIVING["Church Center Giving<br/>verticalchurchnorth.churchcenter.com"]
        GATEWAY["Gateway Church<br/>gateway.tv"]
        VERTICAL_COLUMBUS["Vertical Church Columbus<br/>verticalchurch.life"]
        BIBLE_LOGOS["Bible References<br/>bible.logos.com"]
        ESV_BIBLE["ESV Bible<br/>esvbible.org"]
    end

    subgraph Navigation["Main Navigation"]
        NAV_HOME["Home"]
        NAV_ABOUT["About Us"]
        NAV_SUPPORT["Support Us"]
        NAV_CONTACT["Contact"]
    end

    %% Navigation Links
    NAV_HOME --> HOME
    NAV_ABOUT --> ABOUT
    NAV_SUPPORT --> GIVING
    NAV_CONTACT --> CONTACT

    %% Internal Page Links
    HOME -->|"About Us button"| ABOUT
    ABOUT -->|"More About Our Theology"| BELIEFS
    ABOUT -->|"Contact us link"| CONTACT

    %% External Partner Links
    ABOUT -->|"Dan Ghramm - Gateway Church"| GATEWAY
    ABOUT -->|"Luke Ahrens - Vertical Columbus"| VERTICAL_COLUMBUS

    %% Bible Reference Links (from Beliefs page)
    BELIEFS --> BIBLE_LOGOS
    BELIEFS --> ESV_BIBLE
```

## Page Inventory

### Internal Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Main landing page with welcome message, service times, ministry cards |
| About | `/about` | Church principles, history, mission, leadership team, pillars |
| Beliefs | `/about/beliefs` | Detailed doctrinal statements and theological positions |
| Contact | `/contact` | Contact form, address, phone number, visiting info |

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
        H1["Home"] --> H2["About Us"] --> H3["Support Us"] --> H4["Contact"]
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
    ROOT --> CONTACT["/contact"]
    
    ABOUT --> BELIEFS["/about/beliefs"]
    
    HOME -.->|External| GIVING["churchcenter.com/giving"]
    
    ABOUT -.->|External| GATEWAY["gateway.tv"]
    ABOUT -.->|External| VCOLUMBUS["verticalchurch.life"]
    ABOUT -.->|Internal| CONTACT2["/contact"]
    
    BELIEFS -.->|External| BIBLE["bible.logos.com<br/>(multiple verses)"]
    BELIEFS -.->|External| ESV["esvbible.org<br/>(multiple verses)"]
    
    style GIVING fill:#f9f,stroke:#333
    style GATEWAY fill:#f9f,stroke:#333
    style VCOLUMBUS fill:#f9f,stroke:#333
    style BIBLE fill:#f9f,stroke:#333
    style ESV fill:#f9f,stroke:#333
```

## Summary

**Total Internal Pages:** 4
- Home (`/`)
- About (`/about`)
- Beliefs (`/about/beliefs`)
- Contact (`/contact`)

**Total External Link Destinations:** 5
- Church Center Giving (donations)
- Gateway Church (partner church)
- Vertical Church Columbus (partner church)
- Bible Logos (scripture references)
- ESV Bible (scripture references)

**Navigation Items:** 4 (Home, About Us, Support Us, Contact)

**Ministry Sections (non-linked):** 4 (Small Groups, Worship Service, Children's Ministry, Student Ministry)
