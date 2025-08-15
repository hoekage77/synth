import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flags import set_flag
from services import redis

async def initialize_flags():
    """
    Initializes the feature flags in Redis.
    """
    print("Initializing feature flags in Redis...")
    flags_to_set = {
        "custom_agents": {"enabled": True, "description": "Custom agents feature flag"},
        "mcp_module": {"enabled": True, "description": "MCP module feature flag"},
        "templates_api": {"enabled": True, "description": "Templates API feature flag"},
        "triggers_api": {"enabled": True, "description": "Triggers API feature flag"},
        "workflows_api": {"enabled": True, "description": "Workflows API feature flag"},
        "knowledge_base": {"enabled": True, "description": "Knowledge base feature flag"},
        "pipedream": {"enabled": True, "description": "Pipedream integration feature flag"},
        "credentials_api": {"enabled": True, "description": "Credentials API feature flag"},
        "suna_default_agent": {"enabled": True, "description": "Suna default agent feature flag"},
    }

    for key, value in flags_to_set.items():
        await set_flag(key, value["enabled"], value["description"])
    
    print("Feature flags initialized successfully.")

async def main():
    await redis.initialize_async()
    await initialize_flags()
    await redis.close()

if __name__ == "__main__":
    asyncio.run(main())
