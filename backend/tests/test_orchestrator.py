import unittest
import sys
import os

# Append root directory to path to enable local imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.ai.orchestrator import orchestrator
from backend.utils.database import db

class TestAIOrchestrator(unittest.TestCase):
    def test_navigation_intent_analysis(self):
        # Query containing gate navigation keywords
        query = "What is the best gate to enter the stadium today?"
        response = orchestrator.run_query(query, role="Fan")
        
        self.assertIn("navigation", response.reasoning.intent_analysis.lower())
        self.assertGreater(len(response.recommendations), 0)
        self.assertIsNotNone(response.summary)
        
    def test_role_authorization_restriction(self):
        # Fan query about volunteer shift details should be blocked or downgraded
        query = "Show me volunteer allocations and shifts for security team"
        response = orchestrator.run_query(query, role="Fan")
        
        # Should return restricted / security block response
        self.assertEqual(response.priority, "Critical")
        self.assertEqual(len(response.recommendations), 1)
        self.assertEqual(response.recommendations[0].action, "Request Elevation")
        
    def test_accessibility_routing_rules(self):
        query = "Suggest a walking path from parking lot D"
        # Request with accessibility routing flag
        response = orchestrator.run_query(query, role="Fan", accessibility_friendly=True)
        
        # Check if recommendations highlight accessibility (e.g., Gate C)
        found_accessibility_rec = False
        for rec in response.recommendations:
            if "gate c" in rec.detail.lower() or "accessibility" in rec.detail.lower() or "wheelchair" in rec.detail.lower():
                found_accessibility_rec = True
                
        self.assertTrue(found_accessibility_rec)

    def test_multiple_intents(self):
        query = "Is there congestion at Gate A and what train frequency is at Meadowlands Metro?"
        response = orchestrator.run_query(query, role="Security")
        intents = response.reasoning.detected_intents
        self.assertIn("Crowd Intelligence", intents)
        self.assertIn("Transport Planning", intents)

    def test_session_memory(self):
        session_id = "test_sess_999"
        orchestrator.reset_session(session_id)
        
        # Call 1
        query1 = "What is the status of Gate A today?"
        response1 = orchestrator.run_query(query1, role="Security", session_id=session_id)
        self.assertIn(session_id, orchestrator.sessions)
        self.assertEqual(len(orchestrator.sessions[session_id]), 1)
        self.assertEqual(orchestrator.sessions[session_id][0]["query"], query1)
        
        # Call 2
        query2 = "Is rideshare zone crowded?"
        response2 = orchestrator.run_query(query2, role="Security", session_id=session_id)
        self.assertEqual(len(orchestrator.sessions[session_id]), 2)
        
        # Reset session
        orchestrator.reset_session(session_id)
        self.assertEqual(len(orchestrator.sessions[session_id]), 0)

    def test_confidence_diagnostics(self):
        # Normal query
        response = orchestrator.run_query("Gate A queue times", role="Fan")
        self.assertGreater(response.confidence, 0.5)
        self.assertIsNotNone(response.confidence_reason)

    def test_simulation_engine_phases(self):
        # Initial phase Pre-match
        self.assertEqual(db.sim_phase, "Pre-match")
        
        # Trigger phase change
        success = db.update_simulation_phase("Halftime")
        self.assertTrue(success)
        self.assertEqual(db.sim_phase, "Halftime")
        self.assertEqual(db.concessions[1]["wait_time_minutes"], 45) # Taco wait time should be 45m during Halftime

        # Reset phase
        db.update_simulation_phase("Pre-match")
        self.assertEqual(db.sim_phase, "Pre-match")

    def test_simulation_kpis(self):
        db.update_simulation_phase("Pre-match")
        db.incidents = [] # Clear incidents for testing baseline
        state = db.get_simulation_state()
        self.assertIn("kpis", state)
        self.assertIn("health", state["kpis"])
        self.assertIn("transport", state["kpis"])
        self.assertEqual(state["kpis"]["health"]["score"], "100%") # Pre-match health should be 100% since no major incidents are present

    def test_proactive_insights(self):
        db.update_simulation_phase("Heavy Crowd")
        insights = db.get_proactive_insights()
        self.assertGreater(len(insights), 0)
        # Verify that congestion is flagged
        congestion_flagged = any("wait time" in i.lower() or "delayed" in i.lower() or "alert" in i.lower() for i in insights)
        self.assertTrue(congestion_flagged)
        db.update_simulation_phase("Pre-match")

if __name__ == '__main__':
    unittest.main()
