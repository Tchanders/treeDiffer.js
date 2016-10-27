( function () {
	/*jshint browser:true */

	// Extend QUnit.module to provide a fixture element. This used to be in tests/index.html, but
	// dynamic test runners like Karma build their own web page.
	( function () {
		var orgModule = QUnit.module;

		QUnit.module = function ( name, localEnv ) {
			localEnv = localEnv || {};
			orgModule( name, {
				setup: function () {
					this.fixture = document.createElement( 'div' );
					this.fixture.id = 'qunit-fixture';
					document.body.appendChild( this.fixture );

					if ( localEnv.setup ) {
						localEnv.setup.call( this );
					}
				},
				teardown: function () {
					if ( localEnv.teardown ) {
						localEnv.teardown.call( this );
					}

					this.fixture.parentNode.removeChild( this.fixture );
				}
			} );
		};
	}() );

	/**
	 * Utility for creating iframes
	 *
	 * @param {Function} callback Called when the iframe is done
	 * @param {HTMLElement} callback.iframe
	 * @param {Function} callback.teardown To be called when user is done (performs cleanup and resumes
	 *  QUnit runner).
	 */
	QUnit.tmpIframe = function ( callback ) {
		var iframe = document.createElement( 'iframe' );
		document.getElementById( 'qunit-fixture' ).appendChild( iframe );

		// Support IE8: Without "src", the contentWindow has no 'Object' constructor.
		/*jshint scripturl:true */
		iframe.src = 'javascript:';

		// Support IE6: Iframe contentWindow is populated asynchronously.
		QUnit.stop();
		setTimeout( function () {
			callback( iframe, function () {

				iframe.parentNode.removeChild( iframe );
				iframe = undefined;
				QUnit.start();
			} );
		} );
	};

}() );
