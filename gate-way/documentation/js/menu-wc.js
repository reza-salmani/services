'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gate-way documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-ff3d9998b7c3431b0796ea805fa28345f939a880787399d7a46ca8d52449e0fbd43b5cfa30c410325b4efdb9d7e92d1361c220c919f8ca5bd44ed4df14810dab"' : 'data-bs-target="#xs-injectables-links-module-AppModule-ff3d9998b7c3431b0796ea805fa28345f939a880787399d7a46ca8d52449e0fbd43b5cfa30c410325b4efdb9d7e92d1361c220c919f8ca5bd44ed4df14810dab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ff3d9998b7c3431b0796ea805fa28345f939a880787399d7a46ca8d52449e0fbd43b5cfa30c410325b4efdb9d7e92d1361c220c919f8ca5bd44ed4df14810dab"' :
                                        'id="xs-injectables-links-module-AppModule-ff3d9998b7c3431b0796ea805fa28345f939a880787399d7a46ca8d52449e0fbd43b5cfa30c410325b4efdb9d7e92d1361c220c919f8ca5bd44ed4df14810dab"' }>
                                        <li class="link">
                                            <a href="injectables/CustomLogger.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomLogger</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-c7bc6d8db96ed7e93ddb4b46e0645c0afa3b0946fb8b5d0ff6a71513973a44f4c48c82a81de8763b3d1759d1b1c1dfc32f1a1eb88f95269d263932b42cb6f735"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-c7bc6d8db96ed7e93ddb4b46e0645c0afa3b0946fb8b5d0ff6a71513973a44f4c48c82a81de8763b3d1759d1b1c1dfc32f1a1eb88f95269d263932b42cb6f735"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c7bc6d8db96ed7e93ddb4b46e0645c0afa3b0946fb8b5d0ff6a71513973a44f4c48c82a81de8763b3d1759d1b1c1dfc32f1a1eb88f95269d263932b42cb6f735"' :
                                        'id="xs-injectables-links-module-AuthModule-c7bc6d8db96ed7e93ddb4b46e0645c0afa3b0946fb8b5d0ff6a71513973a44f4c48c82a81de8763b3d1759d1b1c1dfc32f1a1eb88f95269d263932b42cb6f735"' }>
                                        <li class="link">
                                            <a href="injectables/JWTRefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JWTRefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JWTStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JWTStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphqlModule.html" data-type="entity-link" >GraphqlModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/KafkaModule.html" data-type="entity-link" >KafkaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-KafkaModule-6671f0d9121112286b23f15e3eafbfba0b05a7351893940fffe188c9369cd3c79e77eaa959246bcf5624958aede4e258dd08db64a83e4120514d45f474168a2a"' : 'data-bs-target="#xs-injectables-links-module-KafkaModule-6671f0d9121112286b23f15e3eafbfba0b05a7351893940fffe188c9369cd3c79e77eaa959246bcf5624958aede4e258dd08db64a83e4120514d45f474168a2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-KafkaModule-6671f0d9121112286b23f15e3eafbfba0b05a7351893940fffe188c9369cd3c79e77eaa959246bcf5624958aede4e258dd08db64a83e4120514d45f474168a2a"' :
                                        'id="xs-injectables-links-module-KafkaModule-6671f0d9121112286b23f15e3eafbfba0b05a7351893940fffe188c9369cd3c79e77eaa959246bcf5624958aede4e258dd08db64a83e4120514d45f474168a2a"' }>
                                        <li class="link">
                                            <a href="injectables/KafkaHumanResourceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KafkaHumanResourceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-891a5e1b2c2fd736dc26d8cc09454d971a5fe97122afe60e1566a6ded467cd750e7230b18faa95c6d1c7843e0fbca3d564225806cbc1173e6daadda199223407"' : 'data-bs-target="#xs-injectables-links-module-UserModule-891a5e1b2c2fd736dc26d8cc09454d971a5fe97122afe60e1566a6ded467cd750e7230b18faa95c6d1c7843e0fbca3d564225806cbc1173e6daadda199223407"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-891a5e1b2c2fd736dc26d8cc09454d971a5fe97122afe60e1566a6ded467cd750e7230b18faa95c6d1c7843e0fbca3d564225806cbc1173e6daadda199223407"' :
                                        'id="xs-injectables-links-module-UserModule-891a5e1b2c2fd736dc26d8cc09454d971a5fe97122afe60e1566a6ded467cd750e7230b18faa95c6d1c7843e0fbca3d564225806cbc1173e6daadda199223407"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaUsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaUsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsToGraphQLErrorFilter.html" data-type="entity-link" >AllExceptionsToGraphQLErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseQuery.html" data-type="entity-link" >BaseQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/Counter.html" data-type="entity-link" >Counter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserDto.html" data-type="entity-link" >DeleteUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordModel.html" data-type="entity-link" >ForgotPasswordModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlBadGatewayException.html" data-type="entity-link" >GraphQlBadGatewayException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlBadRequestException.html" data-type="entity-link" >GraphQlBadRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlConflictException.html" data-type="entity-link" >GraphQlConflictException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlForbiddenException.html" data-type="entity-link" >GraphQlForbiddenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlInternalServerErrorException.html" data-type="entity-link" >GraphQlInternalServerErrorException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlMethodNotAllowedException.html" data-type="entity-link" >GraphQlMethodNotAllowedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlNotAcceptableException.html" data-type="entity-link" >GraphQlNotAcceptableException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlNotFoundException.html" data-type="entity-link" >GraphQlNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlNotImplementedException.html" data-type="entity-link" >GraphQlNotImplementedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlPayloadTooLargeException.html" data-type="entity-link" >GraphQlPayloadTooLargeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlRequestTimeoutException.html" data-type="entity-link" >GraphQlRequestTimeoutException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlUnauthorizedException.html" data-type="entity-link" >GraphQlUnauthorizedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQlUnsupportedMediaTypeException.html" data-type="entity-link" >GraphQlUnsupportedMediaTypeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtPayLoad.html" data-type="entity-link" >JwtPayLoad</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginModel.html" data-type="entity-link" >LoginModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ManageAvatarUserDto.html" data-type="entity-link" >ManageAvatarUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuStructureModel.html" data-type="entity-link" >MenuStructureModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermittedPage.html" data-type="entity-link" >PermittedPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrismaQuery.html" data-type="entity-link" >PrismaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrismaSingleQuery.html" data-type="entity-link" >PrismaSingleQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleActiveUserDto.html" data-type="entity-link" >ToggleActiveUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePageRolesDto.html" data-type="entity-link" >UpdatePageRolesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRolesToUserDto.html" data-type="entity-link" >UpdateRolesToUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserOutput.html" data-type="entity-link" >UserOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Users.html" data-type="entity-link" >Users</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CustomLogger.html" data-type="entity-link" >CustomLogger</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GraphQLLoggingMiddleware.html" data-type="entity-link" >GraphQLLoggingMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JWTRefreshTokenStrategy.html" data-type="entity-link" >JWTRefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JWTStrategy.html" data-type="entity-link" >JWTStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KafkaHumanResourceService.html" data-type="entity-link" >KafkaHumanResourceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailerService.html" data-type="entity-link" >MailerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaAuthService.html" data-type="entity-link" >PrismaAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaUsersService.html" data-type="entity-link" >PrismaUsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasksService.html" data-type="entity-link" >TasksService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});