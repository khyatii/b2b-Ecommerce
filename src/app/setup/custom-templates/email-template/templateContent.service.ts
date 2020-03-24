import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
@Injectable()


export class TemplateContentService  {
    templateArray=[{'id':1,'txtTemplateName':"Order Notification",'txtSubject':"Order notification for order {{order_number}}",'txtTemplateText':`Hey there,<br><br>
    You have received a new Order from <a href='https://go.tradegecko.com/relationships/{{company.id}}'> {{company.name}} </a><br>
    This Sales Order #{{order_number}} was issued on {{issued_at | date: '%d %b %Y'}}.<br>
    The order will be a total of {{total | money}}.<br>
    {% if notes %} Notes:<br>
    {{notes}}<br>
    {% endif %}<br>
    Summary:<br>
    {% for item in product_line_items %} {{item.quantity | strip_insignificant_zeros}}x {{item.display_name}}<br>
    {% endfor %} {% for item in extra_line_items %} {{item.label}} - {{item.price | money }}<br>
    {% endfor %}<br>
    If you have any questions, please feel free to reply to this email. `},{
        'id':2,'txtTemplateName':"Order Confirmation",'txtSubject':"Order confirmation for order {{order_number}}",'txtTemplateText':`Hi {{contact.first_name | default: 'there' }},
        <br><br>
        Thank you for placing your order using our B2B eCommerce platform, this email is to confirm that we have
         received your recent order and someone from our team has been notified.
        <br><br>
        We just want to confirm a few details you have provided us:<br>
         {% if shipping_address %}<br>
        Shipping address {% if shipping_address.first_name or shipping_address.last_name %}<br>
        {{ shipping_address.first_name }} {{ shipping_address.last_name }} {% endif %} {% if shipping_address.company_name %}<br>
        {{ shipping_address.company_name }} {% endif %} {% if shipping_address.address1 %}<br>
        {{ shipping_address.address1 }} {% endif %} {% if shipping_address.address2 %}<br>
        {{ shipping_address.address2 }} {% endif %} {% if shipping_address.suburb %}<br>
        {{ shipping_address.suburb }} {% endif %}<br>
        {% if shipping_address.city %}{{ shipping_address.city }},{% endif %} {% if shipping_address.state %}
        <br>{{ shipping_address.state }},{% endif %} {% if shipping_address.zip_code %}{{ shipping_address.zip_code }}{% endif %} {% if shipping_address.country %}
        {{ shipping_address.country }} {% endif %} {% endif %} <br>
         {% if billing_address %}<br>
        Billing address {% if billing_address.first_name or billing_address.last_name %}<br>
        {{ billing_address.first_name }} {{ billing_address.last_name }} {% endif %} {% if billing_address.company_name %}<br>
        {{ billing_address.company_name }} {% endif %} {% if billing_address.address1 %}<br>
        {{ billing_address.address1 }} {% endif %} {% if billing_address.address2 %}<br>
        {{ billing_address.address2 }} {% endif %} {% if billing_address.suburb %}<br>
        {{ billing_address.suburb }} {% endif %}<br>
        {% if billing_address.city %}{{ billing_address.city }},{% endif %} {% if billing_address.state %}{{ billing_address.state }},{% endif %}
         {% if billing_address.zip_code %}{{ billing_address.zip_code }}{% endif %} {% if billing_address.country %}
        {{ billing_address.country }} {% endif %} {% endif %} <br>
        Order Summary:<br>
        {% for item in product_line_items %} {{item.quantity}}x {{item.display_name}} {% endfor %} `
    },{
        'id':3,'txtTemplateName':"Shipping Notification",'txtSubject':"Your Order #{{order.order_number}} from a has been shipped",'txtTemplateText':`Hi {{order.contact.first_name | default: 'there' }},<br><br>
        
        Thank you for your order. Here’s a brief overview of your shipment:<br>
        Sales Order #{{order.order_number}}{% if packed_at %} was packed on {{packed_at | date: '%d %b %Y'}}{% endif %}{% if shipped_at %}and shipped on {{shipped_at | date: '%d %b %Y'}}{% endif %}.<br>
         {% if shipping_address %}<br>
        Shipping address {% if shipping_address.first_name or shipping_address.last_name %}<br>
        {{ shipping_address.first_name }} {{ shipping_address.last_name }} {% endif %} {% if shipping_address.company_name %}<br>
        {{ shipping_address.company_name }} {% endif %} {% if shipping_address.address1 %}<br>
        {{ shipping_address.address1 }} {% endif %} {% if shipping_address.address2 %}<br>
        {{ shipping_address.address2 }} {% endif %} {% if shipping_address.suburb %}<br>
        {{ shipping_address.suburb }} {% endif %}<br>
        {% if shipping_address.city %}{{ shipping_address.city }},{% endif %} {% if shipping_address.state %}<br>
        {{ shipping_address.state }},{% endif %} {% if shipping_address.zip_code %}{{ shipping_address.zip_code }}{% endif %} {% if shipping_address.country %}
        {{ shipping_address.country }} {% endif %} {% endif %}  {% if tracking_company or tracking_number or tracking_url %} You can find your shipping details here:
        {% endif %} {% if tracking_company %} Tracking Company: {{tracking_company}}<br>
        {% endif %} {% if tracking_number %} Tracking Number: {{tracking_number}}<br>
        {% endif %} {% if tracking_url %} Tracking URL: {{tracking_url}}<br>
        {% endif %} {% if notes %}<br>
        Notes:<br>
        {{notes}}<br>
        {% endif %}<br>
        Summary:<br>
        {% for item in product_line_items %} {{item.quantity | strip_insignificant_zeros}}x {{item.display_name}}<br>
        {% endfor %} {% for item in extra_line_items %} {{item.display_name}} - {{item.price | money}}<br>
        {% endfor %}<br>
        If you have any questions, please feel free to reply to this email.  `
    },{
        'id':4,'txtTemplateName':"Purchase Order",'txtSubject':"Your Purchase Order #{{order_number}} from a",'txtTemplateText':`Hi there,<br><br>
        
        Purchase Order #{{order_number}}{% if due_at %} is due on {{ due_at | date: '%d %b %Y' }}{% endif %}<br>
        {% if notes %} Notes:<br>
        {{notes}}<br>
        {% endif %}<br>
        Summary:<br>
        {% for item in product_line_items %} {{item.quantity | strip_insignificant_zeros}}x {{item.display_name}}<br>
        {% endfor %}<br>
        If you have any questions, please feel free to reply to this email.   `
    },{
        'id':5,'txtTemplateName':"Sales Order",'txtSubject':"Your Order #{{order_number}} from a",'content':`Hi {{contact.first_name | default: 'there' }},<br><br>
        
        Thank you for your order. Here’s a brief overview:<br>
        Sales Order #{{order_number}} was issued on {{issued_at | date: '%d %B %Y'}}.<br>
        {% if payment_status == 'unpaid' %} The order total is {{total | money}}{% if due_at %} please pay before {{ due_at | date: '%d %b %Y' }}{% endif %}{% if reference_number %} 
        and include this reference number {{reference_number}} in any deposits for our records{% endif %}.<br>
        {% endif %} {% if notes %}<br>
        Notes:<br>
        {{notes}}<br>
        {% endif %}<br>
        Summary:<br>
        {% for item in product_line_items %} {{item.quantity | strip_insignificant_zeros}}x {{item.display_name}}<br>
        {% endfor %} {% for item in extra_line_items %} {{item.label}} - {{item.price | money}}<br>
        {% endfor %}<br>
        If you have any questions, please feel free to reply to this email.    `
    }];
  
}