#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Game Iframe Source Finder Web Application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A Flask web application that finds the source URL of online game iframes.
Follows production-ready best practices and coding standards.

:copyright: (c) 2024
:license: MIT
"""

import os
import logging
from typing import Dict, Optional, Union
from flask import Flask, render_template, request, jsonify, Response
from werkzeug.middleware.proxy_fix import ProxyFix
from finder import IframeFinder

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GameSourceFinderApp:
    """Main application class that handles the Flask app initialization and configuration."""
    
    def __init__(self) -> None:
        """Initialize the Flask application with configuration."""
        self.app = Flask(__name__)
        self.configure_app()
        self.register_routes()
        self.setup_error_handlers()

    def configure_app(self) -> None:
        """Configure Flask application settings."""
        self.app.config.update(
            SECRET_KEY=os.environ.get('SECRET_KEY', os.urandom(24)),
            JSON_SORT_KEYS=False,
            MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max-limit
            TEMPLATES_AUTO_RELOAD=True
        )
        
        # Support for proxy servers
        self.app.wsgi_app = ProxyFix(self.app.wsgi_app, x_proto=1, x_host=1)

    def register_routes(self) -> None:
        """Register application routes."""
        
        @self.app.route('/')
        def index() -> str:
            """Render the main page."""
            try:
                return render_template('index.html')
            except Exception as e:
                logger.error(f"Error rendering index page: {str(e)}")
                return render_template('error.html'), 500

        @self.app.route('/find_source', methods=['POST'])
        def find_source() -> Response:
            """
            Handle the source URL finding request.
            """
            try:
                logger.info("Received find_source request")
                data: Dict[str, str] = request.get_json()
                
                if not data or 'url' not in data:
                    return jsonify({'error': 'Missing URL parameter'}), 400

                url: str = data['url']
                
                # 为每个请求创建新的 IframeFinder 实例
                finder = IframeFinder()
                try:
                    source: Optional[str] = finder.find_game_source(url)
                    if source:
                        return jsonify({'source': source})
                    else:
                        return jsonify({'error': 'No source URL found'}), 404
                finally:
                    finder.close()

            except Exception as e:
                logger.error(f"Error processing request: {str(e)}", exc_info=True)
                return jsonify({'error': 'Internal server error'}), 500

    def setup_error_handlers(self) -> None:
        """Configure error handlers for the application."""
        
        @self.app.errorhandler(404)
        def not_found_error(error) -> tuple[str, int]:
            """Handle 404 errors."""
            return render_template('error.html', error='Page not found'), 404

        @self.app.errorhandler(500)
        def internal_error(error) -> tuple[str, int]:
            """Handle 500 errors."""
            return render_template('error.html', error='Internal server error'), 500

    def run(self, host: str = '0.0.0.0', port: int = 8123, debug: bool = False) -> None:
        """
        Run the Flask application.
        
        Args:
            host: The hostname to listen on
            port: The port of the webserver (default: 8123)
            debug: Enable or disable debug mode
        """
        try:
            self.app.run(host=host, port=port, debug=debug)
        finally:
            self.cleanup()

    def cleanup(self) -> None:
        """Cleanup resources when the application stops."""
        try:
            # No need to close finder here, as each request creates a new instance
            pass
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")

def create_app() -> Flask:
    """
    Application factory function.
    
    Returns:
        Flask application instance
    """
    return GameSourceFinderApp().app

def main() -> None:
    """Main entry point for running the application."""
    # Get configuration from environment variables
    host = os.environ.get('HOST', 'localhost')
    port = int(os.environ.get('PORT', 8123))
    debug = True

    # Create and run application
    app = GameSourceFinderApp()
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    main() 