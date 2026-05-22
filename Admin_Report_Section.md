### 4.X Administrative Portal Implementation

The administrative portal serves as the centralized management interface for electoral officials to oversee the voting process, configure elections, and manage candidate data. Security is enforced through role-based access control, ensuring only authorized personnel can access the dashboard.

**Figure 4.13: Administrative Login Interface**
The admin login requires secure credentials. Once authenticated, the administrator is granted a secure session token that allows access to the management routes.
*(Insert `01_admin_login.png` here)*

**Figure 4.14: Administrator Dashboard**
Upon successful login, the administrator is presented with a comprehensive dashboard. This interface provides high-level metrics, including the total number of registered voters, active elections, and system status, allowing officials to monitor the platform at a glance.
*(Insert `03_admin_dashboard.png` here)*

**Figure 4.15: Election Configuration Interface**
The system allows administrators to create and configure new electoral events. Officials can define the election title, description, and set strict start and end dates. This data is synchronized with the PostgreSQL database and subsequently linked to the blockchain smart contract to enforce voting periods.
*(Insert `04_admin_elections.png` here)*

**Figure 4.16: Candidate Management Interface**
This interface enables the administrative registration of electoral candidates. Officials can input candidate details and associate them with specific active elections, dynamically updating the ballot that voters will see in the user portal.
*(Insert `05_admin_candidates.png` here)*

**Figure 4.17: Real-Time Results Monitoring**
The results interface provides a transparent, real-time aggregation of cast ballots. Because the votes are tallied directly from the immutable blockchain smart contract, this interface guarantees cryptographic accuracy and prevents manual result manipulation by electoral staff.
*(Insert `07_admin_results.png` here)*
