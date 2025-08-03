package com.echo.controller;

import com.echo.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        
        if (user != null) {
            model.addAttribute("user", user);
            return "dashboard";
        }
        
        return "landing";
    }
    
    @GetMapping("/login")
    public String login() {
        return "auth";
    }
    
    @GetMapping("/register")
    public String register() {
        return "auth";
    }
    
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            return "redirect:/login";
        }
        
        model.addAttribute("user", user);
        return "dashboard";
    }
}