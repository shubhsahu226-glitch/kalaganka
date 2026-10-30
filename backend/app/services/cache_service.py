"""
In-memory caching service for identical solar calculation queries.
Uses OrderedDict to implement an LRU cache without external dependencies like Redis for MVP.
"""

from collections import OrderedDict
from typing import Any, Optional


class SimpleLRUCache:
    """Thread-safe-friendly in-memory LRU cache."""
    def __init__(self, maxsize: int = 1024):
        self.maxsize = maxsize
        self._cache: OrderedDict = OrderedDict()

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            self._cache.move_to_end(key)
            return self._cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self.maxsize:
            self._cache.popitem(last=False)

    def clear(self) -> None:
        self._cache.clear()


solar_cache = SimpleLRUCache(maxsize=1024)
place_cache = SimpleLRUCache(maxsize=256)

