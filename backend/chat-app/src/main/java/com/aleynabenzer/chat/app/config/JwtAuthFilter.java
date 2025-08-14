package com.aleynabenzer.chat.app.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aleynabenzer.chat.app.service.IJwtUtils;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private static final String AUTHORIZATION = "Authorization";
	
	private IJwtUtils jwtUtilsService;
	private UserDetailsService userService;
	
	public JwtAuthFilter(IJwtUtils jwtUtilsService,UserDetailsService userService ) {
		this.jwtUtilsService = jwtUtilsService;
		this.userService = userService;
	}
	
	public Authentication getAuthenticationFromToken(String jwtToken) {
        try {
            String userEmail = jwtUtilsService.extractUsername(jwtToken);

            if (userEmail != null) {
                UserDetails userDetails = userService.loadUserByUsername(userEmail);

                if (jwtUtilsService.isTokenValid(jwtToken, userDetails)) {
                    return new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                }
            }
        } catch (ExpiredJwtException ex) {
            logger.warn("Expired JWT: " + ex.getMessage());
        } catch (Exception e) {
            logger.error("Invalid JWT: " + e.getMessage());
        }
        return null;
    }
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		final String authHeader = request.getHeader(AUTHORIZATION);
		final String jwtToken;
		final String userEmail;
		
		if(authHeader == null || authHeader.isBlank()
				|| !authHeader.startsWith("Bearer ")) {// Authorization boş gelmişse security filter chain yoluna devam etsin
			filterChain.doFilter(request, response);
			return;
		}
		
		jwtToken = authHeader.substring(7); // Bearer ldjrieri

	    try {
	        userEmail = jwtUtilsService.extractUsername(jwtToken); // request ile gelen token içinden eposta çıkarıldı
	    } catch (ExpiredJwtException ex) {
	        logger.warn("Expired JWT: " + ex.getMessage());
	        // continue filter chain without setting authentication
	        filterChain.doFilter(request, response);
	        return;
	    }
		
		if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = userService.loadUserByUsername(userEmail);
			
			if(jwtUtilsService.isTokenValid(jwtToken, userDetails)) {
				SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				securityContext.setAuthentication(token);
				SecurityContextHolder.setContext(securityContext);
			}
		}
		
		filterChain.doFilter(request, response);

	}
}
